export class ServiceType {
  static get NORMAL() {
    return 'normal';
  }

  static get RENT() {
    return 'rent';
  }

  static get FLATRATE() {
    return 'flatrate';
  }

  static get RIDISELECT() {
    return 'ridiselect';
  }

  static isExpirable(serviceType) {
    return serviceType === this.RENT || serviceType === this.FLATRATE || serviceType === this.RIDISELECT;
  }

  static isRidiselect(serviceType) {
    return serviceType === this.RIDISELECT;
  }
}
