import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";

const SignIn = ({ providers }) => {
  return (
    <div className="flex flex-col items-center space-y-32 mt-32">
      <Image
        src="https://cdn-icons-png.flaticon.com/128/733/733579.png"
        width={100}
        height={100}
        alt="Twitter"
      />
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              className="bg-sky-400 hover:bg-sky-500 px-4 py-2 rounded-lg text-white text-xl"
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
    </div>
  );
};

export default SignIn;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
