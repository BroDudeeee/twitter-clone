/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const NewsArticles = ({ article }) => {
  return (
    <Link href={article.url}>
      <div className="mb-2 flex items-center justify-between hover:bg-gray-200 cursor-pointer p-2 rounded-lg">
        <div>
          <p>{article.title}</p>
        </div>
        <img
          src={article.urlToImage}
          alt="img"
          className="h-10 w-16 rounded-xl "
        />
      </div>
    </Link>
  );
};

export default NewsArticles;
