export default class Payment {
  constructor(paymentSubject) {
    this.paymentSubject = paymentSubject;
  }

  creditCard({ id, username }) {
    console.log(`\nA payment ocurred from ${username}`);
    this.paymentSubject.notify({ id, username });
  }
}
