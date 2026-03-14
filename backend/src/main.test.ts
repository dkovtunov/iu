import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Mocking NestFactory.create
vi.mock('@nestjs/core', () => ({
  NestFactory: {
    create: vi.fn(),
  },
}));

// Mocking process.env
vi.stubGlobal('process', {
  env: {
    APP_PORT: '3000',
  },
});

// Mocking app object
const mockApp = {
  useGlobalPipes: vi.fn(),
  enableCors: vi.fn(),
  listen: vi.fn(),
};

// Assigning the mock app to the NestFactory.create mock
NestFactory.create.mockResolvedValue(mockApp);

// Importing the bootstrap function
import { bootstrap } from './main';

// Test suite for the bootstrap function
describe('bootstrap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create the app using NestFactory', async () => {
    await bootstrap();
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
  });

  it('should use global validation pipe with correct options', async () => {
    await bootstrap();
    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      new ValidationPipe({ whitelist: true, transform: true })
    );
  });

  it('should enable CORS', async () => {
    await bootstrap();
    expect(mockApp.enableCors).toHaveBeenCalled();
  });

  it('should listen on the port specified in process.env.APP_PORT', async () => {
    await bootstrap();
    expect(mockApp.listen).toHaveBeenCalledWith('3000');
  });

  it('should handle errors during app creation', async () => {
    const error = new Error('Failed to create app');
    NestFactory.create.mockRejectedValueOnce(error);

    await expect(bootstrap()).rejects.toThrow('Failed to create app');
  });

  it('should handle errors during app listening', async () => {
    const error = new Error('Failed to listen');
    mockApp.listen.mockRejectedValueOnce(error);

    await expect(bootstrap()).rejects.toThrow('Failed to listen');
  });
});
