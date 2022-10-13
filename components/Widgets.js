import {
  ArrowDownIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import NewsArticles from "./NewsArticles";

const Widgets = ({ articles }) => {
  const [numArticles, setNumArticles] = useState(3);

  const addArticles = () => {
    if (articles.length - numArticles >= 3) {
      setNumArticles(numArticles + 3);
    } else if (articles.length - numArticles > 0) {
      setNumArticles(numArticles + (articles.length - numArticles));
    }
  };

  const removeArticles = () => {
    if (numArticles > 3) {
      setNumArticles(numArticles - 3);
    }
  };

  return (
    <div className="hidden  max-w-sm lg:inline  lg:max-w-20 xl:flex-grow space-y-4 p-4 bg-white">
      <div className="w-full bg-white z-50 sticky top-1 ">
        <div className="flex items-center rounded-full m-2 w-72 border border-gray-300 bg-gray-100 pl-2 ring-1 ring-gray-100 hover:ring-gray-500">
          <MagnifyingGlassIcon className="h-6 text-gray-500" />
          <input
            type="text"
            placeholder="Search Twitter"
            className="w-64  outline-none py-2 rounded-full bg-transparent text-xl text-gray-700 p-4"
          />
        </div>
      </div>
      <div className="bg-gray-100 w-72 ml-2 p-2 space-y-4 rounded-lg sticky top-16">
        <h1 className="text-xl font-semibold">What is Happening</h1>
        <div>
          <AnimatePresence>
            {articles.slice(0, numArticles).map((article) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                exit={{ opacity: 0 }}
              >
                <NewsArticles article={article} />
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex justify-between">
            <ArrowDownIcon className="icon h-6" onClick={() => addArticles()} />
            <ArrowUpIcon
              className="icon h-6"
              onClick={() => removeArticles()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widgets;
