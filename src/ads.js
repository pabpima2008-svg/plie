import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
  MaxAdContentRating,
  AdmobConsentStatus
} from '@capacitor-community/admob';

/* ------------------------------------------------------------------
   CONFIGURACION
   No hay que tocar este archivo para publicar. Los valores reales llegan
   al compilar desde las variables de GitHub (ver PUBLICAR.md):
     ADMOB_BANNER_ID  -> ID del bloque de anuncios banner
     ADMOB_APP_ID     -> ID de la app en AdMob (se usa en Android)
     PRIVACY_URL      -> URL de la politica de privacidad
   Si faltan, se usan los anuncios de PRUEBA de Google (no dan dinero).
   ------------------------------------------------------------------ */
/* global __BANNER_ID__, __PRIVACY_URL__, __RELEASE__ */
const TEST_BANNER = 'ca-app-pub-3940256099942544/6300978111';
const INJECTED_BANNER = typeof __BANNER_ID__ !== 'undefined' ? __BANNER_ID__ : '';
export const CONFIG = {
  // Anuncios de prueba mientras no haya un ID real de banner.
  TEST_MODE: !INJECTED_BANNER,
  BANNER_ID: INJECTED_BANNER || TEST_BANNER,
  // El interruptor 'Modo prueba' solo existe en la version de pruebas, nunca en la de Play.
  TEST_TOOLS: !(typeof __RELEASE__ !== 'undefined' && __RELEASE__),
  PRODUCT_REMOVE_ADS: 'remove_ads',
  PRIVACY_URL: (typeof __PRIVACY_URL__ !== 'undefined' && __PRIVACY_URL__) || ''
};

export const isNative = () => {
  try { return Capacitor.isNativePlatform(); } catch { return false; }
};

/* Perfil de anuncios segun la edad:
   child  = menor de 13  -> tratamiento dirigido a menores, anuncios generales, no personalizados
   teen   = 13 a 17      -> menor de edad de consentimiento, no personalizados
   adult  = 18 o mas     -> anuncios normales (con formulario de consentimiento donde haga falta) */
export function adProfile(age) {
  if (age < 13) return 'child';
  if (age < 18) return 'teen';
  return 'adult';
}

// Alto de la barra de navegacion de Android (lo inyecta Capacitor como variable CSS).
function bottomInset() {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom');
    return Math.max(0, parseInt(v, 10) || 0);
  } catch { return 0; }
}

export const Ads = {
  ready: false,
  profile: null,
  visible: false,
  listenersSet: false,
  onHeight: () => {},

  async init(profile) {
    if (!isNative()) { this.profile = profile; this.ready = true; return; }
    try {
      this.profile = profile;
      const isChild = profile === 'child';
      const isMinor = profile !== 'adult';

      // Consentimiento (UMP) solo para mayores de edad; los menores no ven anuncios personalizados.
      if (!isMinor) {
        try {
          const info = await AdMob.requestConsentInfo({ tagForUnderAgeOfConsent: false });
          if (info.isConsentFormAvailable && info.status === AdmobConsentStatus.REQUIRED) {
            await AdMob.showConsentForm();
          }
        } catch (e) { console.warn('consent', e); }
      }

      await AdMob.initialize({
        initializeForTesting: CONFIG.TEST_MODE,
        tagForChildDirectedTreatment: isChild,
        tagForUnderAgeOfConsent: isMinor,
        maxAdContentRating: isChild
          ? MaxAdContentRating.General
          : isMinor ? MaxAdContentRating.ParentalGuidance : MaxAdContentRating.Teen
      });

      if (!this.listenersSet) {
        this.listenersSet = true;
        AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size) => {
          this.onHeight(size && size.height ? size.height : 0);
        });
      }
      this.ready = true;
    } catch (e) {
      console.warn('AdMob init failed', e);
      this.ready = false;
    }
  },

  async showBanner() {
    if (!this.ready || !isNative()) return;
    try {
      await AdMob.showBanner({
        adId: CONFIG.BANNER_ID,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: bottomInset(),   // por encima de la barra de navegacion de Android
        isTesting: CONFIG.TEST_MODE,
        npa: this.profile !== 'adult' // anuncios no personalizados para menores
      });
      this.visible = true;
    } catch (e) { console.warn('showBanner', e); }
  },

  async hideBanner() {
    this.onHeight(0);
    if (!this.ready || !isNative()) return;
    try { await AdMob.removeBanner(); this.visible = false; } catch (e) { console.warn('removeBanner', e); }
  }
};

/* ------------------------------------------------------------------
   Compra unica "Quitar anuncios" (Google Play Billing via cordova-plugin-purchase)
   Debes crear el producto "remove_ads" (compra unica) en Play Console.
   ------------------------------------------------------------------ */
export const Billing = {
  ready: false,
  price: '',
  onOwned: () => {},

  _lib() { return typeof window !== 'undefined' ? window.CdvPurchase : undefined; },

  async init() {
    if (!isNative()) return;
    // El plugin se inyecta cuando el dispositivo esta listo.
    for (let i = 0; i < 40 && !this._lib(); i++) await new Promise(r => setTimeout(r, 250));
    const lib = this._lib();
    if (!lib) return;
    try {
      const { store, Platform, ProductType } = lib;
      store.register([{ id: CONFIG.PRODUCT_REMOVE_ADS, type: ProductType.NON_CONSUMABLE, platform: Platform.GOOGLE_PLAY }]);
      store.when()
        .approved((tx) => tx.finish())
        .finished(() => this._sync())
        .productUpdated(() => this._sync())
        .receiptUpdated(() => this._sync());
      await store.initialize([Platform.GOOGLE_PLAY]);
      this.ready = true;
      this._sync();
    } catch (e) { console.warn('billing init', e); }
  },

  _sync() {
    const lib = this._lib();
    if (!lib) return;
    try {
      const { store, Platform } = lib;
      const product = store.get(CONFIG.PRODUCT_REMOVE_ADS, Platform.GOOGLE_PLAY);
      const offer = product && product.getOffer && product.getOffer();
      const phase = offer && offer.pricingPhases && offer.pricingPhases[0];
      if (phase && phase.price) this.price = phase.price;
      if (store.owned(CONFIG.PRODUCT_REMOVE_ADS)) this.onOwned();
    } catch (e) { console.warn('billing sync', e); }
  },

  // Devuelve true si se ha lanzado el flujo de compra.
  async purchase() {
    if (!isNative()) { this.onOwned(); return true; } // simulacion solo en vista previa web
    const lib = this._lib();
    if (!lib || !this.ready) return false;
    try {
      const { store, Platform } = lib;
      const product = store.get(CONFIG.PRODUCT_REMOVE_ADS, Platform.GOOGLE_PLAY);
      const offer = product && product.getOffer && product.getOffer();
      if (!offer) return false;
      const err = await store.order(offer);
      return !err;
    } catch (e) { console.warn('purchase', e); return false; }
  },

  async restore() {
    if (!isNative()) return true;
    const lib = this._lib();
    if (!lib || !this.ready) return false;
    try { await lib.store.restorePurchases(); this._sync(); return true; } catch (e) { return false; }
  }
};
