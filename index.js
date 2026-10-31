import dotenv from "dotenv"; //importa a biblioteca
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const rl = readline.createInterface({
    input: stdin,
    output: stdout
});
dotenv.config();//carrega as variáveis de ambiente do arquivo .env
const historico = [
    {
        role: "system",
        content: "Você é um professor de programação. Explique os assuntos de maneira simples e utilize exemplos práticos."
    }
];
while (true) {
    const pergunta = await rl.question("Você: ");
    if (pergunta.toLowerCase() === "sair") {
            break;
        }
    try{

        const resposta = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: historico
            })
        }
    );

    const dados = await resposta.json();
    if (!resposta.ok) {
        console.log("Erro na API:", dados.error?.message);
        continue;
    }

    historico.push({
            role: "user",
            content: pergunta
        });

    console.log(dados.choices[0].message.content);
    historico.push(dados.choices[0].message);

    }
    catch (error) {
        console.error("Erro ao processar a pergunta:", error);
    }
}

rl.close();