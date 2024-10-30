import { expect, describe, test, jest } from "@jest/globals";
import Payment from "../src/events/payment.js";
import Marketing from "../src/observers/marketing.js";
import Shipment from "../src/observers/shipment.js";
import PaymentSubject from "../src/subjects/paymentSubject.js";

describe("Test Suit for Observer Pattern", () => {
  test("#PaymentSubject should notify observer", () => {
    const subject = new PaymentSubject();
    const observer = {
      update: jest.fn(),
    };
    const data = "hello world";
    const expected = data;
    subject.subscribe(observer);
    subject.notify(data);
    expect(observer.update).toHaveBeenCalledWith(expected);
  });
  test("#PaymentSubject should not notify unsubscribed observers", () => {
    const subject = new PaymentSubject();
    const observer = {
      update: jest.fn(),
    };
    const data = "hello world";
    const expected = data;
    subject.subscribe(observer);
    subject.unsubscribe(observer);
    subject.notify(data);
    expect(observer.update).not.toHaveBeenCalled();
  });
  test("#PaymentSubject should notify subject after a credit card transaction", () => {
    const subject = new PaymentSubject();
    const payment = new Payment(subject);

    const paymentSubjectNotifierSpy = jest.spyOn(subject, subject.notify.name);
    const data = { username: "vyctor", id: 3 };
    payment.creditCard(data);
    expect(paymentSubjectNotifierSpy).toBeCalledWith(data);
  });
  test("#PaymentSubject should notify subject after a credit card transaction", () => {
    const subject = new PaymentSubject();
    const shipment = new Shipment();
    const marketing = new Marketing();

    const shipmentSpy = jest.spyOn(shipment, shipment.update.name);
    const marketingSpy = jest.spyOn(marketing, marketing.update.name);

    subject.subscribe(shipment);
    subject.subscribe(marketing);

    const payment = new Payment(subject);
    const data = { username: "vyctor", id: 3 };
    payment.creditCard(data);

    expect(shipmentSpy).toBeCalledWith(data);
    expect(marketingSpy).toBeCalledWith(data);
  });
});
