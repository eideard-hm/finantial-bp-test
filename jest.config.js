module.exports = {
  preset: 'jest-preset-angular',
  roots: ['src'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '^@products/(.*)$': '<rootDir>/src/app/products/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@services/(.*)$': '<rootDir>/src/app/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/app/utils/$1',
    '^@validators/(.*)$': '<rootDir>/src/app/validators/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
  },
};
