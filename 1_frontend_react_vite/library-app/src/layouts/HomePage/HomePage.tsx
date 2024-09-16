import BookCarousel from "./components/Carousel";
import ExportTopBooks from "./components/ExploreTopBooks";
import Heros from "./components/Hero";
import LibraryServices from "./components/LibraryServices";

export const HomePage = () => {
  return (
    <>
      <ExportTopBooks />
      <BookCarousel />
      <Heros />
      <LibraryServices />
    </>
  );
};
