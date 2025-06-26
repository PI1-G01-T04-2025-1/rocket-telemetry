import { Button } from "@/components/ui/button";

export const HomeView = () => {
  return (
    <div className="md:max-w-7xl md:mx-auto mx-4">
      <div className="w-full flex justify-between items-center min-h-[70px]">
        <h1 className="scroll-m-20 text-center text-4xl tracking-tight text-balance font-(family-name:--font-itim)">
          Oasis Rocket
        </h1>
        <nav>
          <Button>Hello World!</Button>
        </nav>
      </div>
    </div>
  );
};
