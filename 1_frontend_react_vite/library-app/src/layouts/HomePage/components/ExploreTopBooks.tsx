import { Link } from "react-router-dom";
import { Button } from "src/components/ui/button";
import backgroundImage from "src/Images/PublicImages/image-2.jpg";

const ExportTopBooks = () => {
  return (
    <div className="relative flex h-[50vh] items-center justify-center overflow-hidden bg-cover bg-center md:h-[60vh]">
      <img
        src={backgroundImage}
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50"></div>
      <div className="z-10 flex flex-col items-start space-y-4 p-4 text-white">
        <h1 className="text-2xl font-bold md:text-3xl">
          Find your next adventure
        </h1>
        <p className="">Where would you like to go next</p>
        <div>
          <Button
            asChild
            variant="outline"
            className="border-2 border-cyan-700 bg-cyan-700 text-white"
          >
            <Link to="/search">Explore top books</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportTopBooks;
