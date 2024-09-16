import { useOktaAuth } from "@okta/okta-react";
import { Link } from "react-router-dom";
import { Button } from "src/components/ui/button";
import Service1 from "src/Images/PublicImages/image-3.jpg";

const LibraryServices = () => {
  const { authState } = useOktaAuth();

  return (
    <div className="m-[5rem] flex flex-col gap-10 rounded-lg border border-gray-200 p-8 shadow-md transition-shadow duration-300 hover:shadow-xl sm:flex-row">
      <div className="flex flex-col justify-center gap-4 sm:w-2/3">
        <h3 className="text-lg font-bold sm:text-xl">
          Can't find what you are looking for ?
        </h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat qui,
          ut voluptatum maxime rerum hic
        </p>
        <div>
          {authState?.isAuthenticated ? (
            <Button
              asChild
              variant="outline"
              className="border-2 border-cyan-700 bg-cyan-700 text-white"
            >
              <Link to="/messages">Library Services</Link>
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
      <div className="flex-shrink-0 overflow-hidden sm:aspect-square sm:w-1/3">
        <img
          src={Service1}
          alt="service_image1"
          className="h-full w-full rounded-lg object-cover shadow-lg"
        />
      </div>
    </div>
  );
};

export default LibraryServices;
