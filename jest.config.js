module.exports = {
  transformIgnorePatterns: [
    "/node_modules/(?!axios)/"
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
};