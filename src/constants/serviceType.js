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

  static get SELECT() {
    return 'ridiselect';
  }

  static get STORE() {
    return 'ridibooks';
  }

  static isExpirable(serviceType) {
    return serviceType === this.RENT || serviceType === this.FLATRATE || serviceType === this.SELECT;
  }

  static isRidiselect(serviceType) {
    return serviceType === this.SELECT;
  }
}
