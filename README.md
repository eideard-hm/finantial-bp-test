# Proyecto Angular con Signals y Arquitectura Limpia

Este proyecto es una aplicación desarrollada con Angular versión 18.1.2. Utiliza señales (signals), server side rendering (SSR) y sigue los principios de arquitectura limpia y componetización.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)

## Descripción

Esta aplicación es un ejemplo de cómo estructurar un proyecto Angular utilizando señales para la gestión de estado, server side rendering para mejorar el rendimiento, SEO de la app y aplicando los principios de arquitectura limpia y componetización.

## Características

- Angular 18.1.2
- Uso de Signals para gestión de estado
- Arquitectura limpia
- Alta componetización

## Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu máquina:

- Node.js (>= 14.0.0)
- npm (>= 6.0.0) o yarn (>= 1.0.0)
- Angular CLI (opcional, pero recomendado para desarrollo)

## Instalación

1. Clona este repositorio:

```bash
git https://github.com/eideard-hm/finantial-bp-test
cd finantial-bp-test
```

## Uso

Para ejecutar la aplicación, sigue estos pasos:

### 1. Instalar Dependencias

Primero, asegúrate de instalar todas las dependencias necesarias para el correcto funcionamiento del cliente y el servidor.

```bash
# Instalar dependencias del cliente
npm install
# o si prefieres yarn
yarn install
# o si prefieres pnpm
pnpm install
```

### 2. Configurar el servidor backend

```bash
cd server

# Instalar dependencias
npm install
# o si prefieres yarn
yarn install
# o si prefieres pnpm
pnpm install

# Levantar el servidor backend
npm run start:dev
# o si prefieres yarn
yarn start:dev
# o si prefieres pnpm
pnpm start:dev
```

### 3. Ejecutar el proyecto del cliente

```bash
# Ejecutar el servidor del ciente
npm run start
# o si prefieres yarn
yarn start
# o si prefieres pnpm
pnpm start
```

### 3. Ejecutar pruebas

```bash
# Ejecutar los test con jest
npm run test
# o si prefieres yarn
yarn test
# o si prefieres pnpm
pnpm test
```
