export default class Shipment {
  update({ id, username }) {
    console.log(
      `[${id}]: [Shipment] will pack the user's order to [${username}]`
    );
  }
}
