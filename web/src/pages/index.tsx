import Image from "next/image";
import { useState, FormEvent } from "react";

import logoImg from "../assets/logo.svg";
import iconCheckImg from "../assets/icon-check.svg";
import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";

import { api } from "../lib";

type HomeProps = {
  poolCount: number;
  guessCount: number;
  userCount: number;
};

export default function Home({ guessCount, poolCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  const hasValue = (value: number, hasColor?: string) => {
    const spanClass = hasColor
      ? `font-bold text-xl mr-2 ${hasColor}`
      : `font-bold text-2xl`;
    return value > 0 ? <span className={spanClass}>+{value}</span> : null;
  };

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert(
        "Bolão criado com sucesso, o código fiu copiado para a área de transferência!"
      );

      setPoolTitle("");
    } catch (err) {
      console.error(err);
      alert("Falha ao criar o bolão, tente novamente!");
    }
  }
  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />

          <strong className="text-gray-100 text-xl">
            {hasValue(userCount, "text-ignite-500")}
            pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            value={poolTitle}
            onChange={(event) => setPoolTitle(event.target.value)}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              {hasValue(poolCount)}
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              {hasValue(guessCount)}
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image src={appPreviewImg} alt="Aside Image" quality={100} />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [
    poolCountResponse,
    guessCountResponse,
    userCountResponse
  ] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count'),
  ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }
  }
}