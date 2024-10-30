export default class Marketing {
  update({ id, username }) {
    console.log(
      `[${id}]: [Marketing] will send a welcome email to [${username}]`
    );
  }
}
