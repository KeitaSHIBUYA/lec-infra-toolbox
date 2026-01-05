import { FaGithub } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} lec-infra.com All rights
              reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="https://github.com/KeitaSHIBUYA/lec-infra-toolbox"
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub className="w-6 h-6" />
            </a>
            {/* 必要に応じてPrivacy Policyなどを追加 */}
          </div>
        </div>
      </div>
    </footer>
  );
};
