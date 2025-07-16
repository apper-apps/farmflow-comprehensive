import { motion } from "framer-motion";

const Loading = ({ type = "cards", count = 3 }) => {
  const shimmer = {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
    },
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "linear",
    },
  };

  const shimmerClass = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`h-4 rounded ${shimmerClass}`}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
            <motion.div
              className={`h-8 rounded ${shimmerClass}`}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
            <motion.div
              className={`h-3 w-3/4 rounded ${shimmerClass}`}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <motion.div
            className={`h-6 w-48 rounded ${shimmerClass} mb-4`}
            animate={shimmer.animate}
            transition={shimmer.transition}
          />
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className={`h-4 w-1/4 rounded ${shimmerClass}`}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div
                  className={`h-4 w-1/3 rounded ${shimmerClass}`}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div
                  className={`h-4 w-1/4 rounded ${shimmerClass}`}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div
                  className={`h-4 w-1/6 rounded ${shimmerClass}`}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-64">
      <motion.div
        className="w-12 h-12 border-4 border-forest-200 border-t-forest-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;