import Desktop1 from "src/Images/PublicImages/image-4.jpg";
import Desktop2 from "src/Images/PublicImages/image-1.jpg";
import { Button } from "src/components/ui/button";
import { Link } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";

const Heros = () => {
  const { authState } = useOktaAuth();

  return (
    <div className="m-[5rem] grid grid-cols-1 gap-[3rem] p-4 sm:grid-cols-2">
      <div className="h-full w-full sm:order-1">
        <img
          src={Desktop1}
          alt="desktop_image1"
          className="h-full w-full rounded-lg object-cover shadow-lg"
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 sm:order-2 sm:w-10/12">
        <h3 className="text-xl font-bold">What have you been reading ?</h3>
        <div className="text-gray-500">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corruptiillo
          fugiat id ad ipsum ratione laboriosam molestias porro esse non nostrum
        </div>
        <div>
          {authState?.isAuthenticated ? (
            <Button
              asChild
              variant="outline"
              className="border-2 border-cyan-700 bg-cyan-700 text-white"
            >
              <Link to="/search">Explore top books</Link>
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              className="border-2 border-cyan-700 bg-cyan-700 text-white"
            >
              <Link to="/login">Sign up</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="h-full w-full sm:order-4">
        <img
          src={Desktop2}
          alt="desktop_image2"
          className="h-full w-full rounded-lg object-cover shadow-lg"
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 sm:order-3 sm:ml-auto sm:w-10/12">
        <h3 className="text-xl font-bold">
          Our collection is always changing!
        </h3>
        <div className="text-gray-500">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corruptiillo
          fugiat id ad ipsum ratione laboriosam molestias porro esse non nostrum
        </div>
      </div>
    </div>
  );
};

export default Heros;
