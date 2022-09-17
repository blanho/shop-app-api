# Blanho E-Commerce

## Table of Content

- [Introduction](#introduction)
- [Configuration](#configuration)
- [Technology](#technology)
- [Description](#description)
- [Features](#features)
- [Entity](#entity)
- [License](#license)

## Introduction

A Blog website using NodeJs, ExpressJs, and Mongoose.
Please read configuration before running this project to get rid of some unessential errors

## Description

The website resembles a real store and you can purchase products and also add them to the cart and pay for them. If you try to check out your process, it won't work because I don't include UI functionality there

I'll supplement UI functionality in MERN STACK Project.
Follow for more: [blanho](https://github.com/blanho)

## Configuration

To run this application, you have to follow my own environmental variables. For security reasons, some variables have been hidden from view and used as environmental variables that you must set up your variables in .env file before running your apps.

Below are the instructions guiding you how to run my app easily to get rid of some unessential errors

- Install Package: npm install
- PORT: A port is a virtual point where network connections start and end
- MONGO_URI: this is the connection string of your MongoDB Atlas database.
- JWT_SECRET_KEY: SECRET KEY helps you sign your token as well as verify when users log in
- NODEMAILER_HOST, NODEMAILER_PORT: You must provide nodemailer host as well as nodemailer port through accessing ethereal.email that will grant you host and post to help you configure your running apps
- NODEMAILER_USER, NODEMAILER_PASS: User and Password were granted by nodemailer allowing you to send / receive message. Please put real email and password here because you will receive the messages sent from users
- CLOUDINARY_NAME, CLOUDINARY_API_KEY: I was using cloudinary to store my image. Your cloud name and API key are used for enabling or configuring a variety of Cloudinary Programmable Media features
- CLOUDINARY_API_SECRET: API Secret is used for authentication and should never be exposed in client-side or in any other way outside your organization

When you finish your configuration setup, you can run: npm start in the terminal to start the server.

## Technology

The application has been built with:

- NodeJS: 8.5.5
- ExpressJS: 4.18.1
- MongoDB: 5.0.9
- JSON WEB TOKEN: 8.5.1
- NODEMAILER: 6.7.8
- COOKIE-PARSER: 1.4.6
- CLOUDINARY: 1.31.0

## Features

My website uses accessToken and refreshToken attached to Cookie to protect user information

Users can sort, search, filter products based on productName, price as well. I've inserted pagination making user experience better

Users can do some functionality below:

- Create an account by verifying email
- Login, Logout
- Reset password by sending email
- Update profile information
- Update password
- Browse available products added by admin
- Create, update, delete, get review
- Add products to the shopping cart
- Delete and update products from shopping cart
- Get Order Details
- Show all orders user have
- Checkout is used Stripe and payment is sent to admin

Admin can do some functionality below:

- Have all functionalities of user
- CRUD - Users
- CRUD - Categories
- CRUD - Shippers
- CRUD - Suppliers
- Get All Orders

## Database

All the models can be found in the models directory using Mongoose

## User

- firstName(String)
- lastName(String)
- email(String)
- password(String)
- image(String)
- role(String)
- verificationToken(String)
- verified(Date)
- isVerified(Boolean)
- passwordToken(String)
- passwordExpiration(Date)
- cloudinary_id(String)

## Category

- categoryName(String)
- description(String)

## Shipper

- shipperName(String)
- phone(String)

## Supplier

- supplierName(String)
- contactName(String)
- address(String)
- city(String)
- phone(String)

## Token

- refreshToken(String)
- ip(String)
- userAgent(String)
- isValid(Boolean)

## Review

- comment(String)
- rating(Number)

## Product

- productName(String)
- description(String)
- image(String)
- price(Number)
- colors([String])
- featured(Boolean)
- freeShipping(Boolean)
- inStock(Number)
- averageRating(Number)
- numOfReviews(Number)

## SingleOrder

- productName(String)
- image(String)
- price(Number)
- amount(Number)

## Orders

- tax(Number)
- shippingFee(Number)
- subtotal(Number)
- total(Number)
- status(String)
- cartItems([SingleOrder])
- clientSecret(String)
- paymentIntentId(String)

## License

- [![License](https://img.shields.io/:License-MIT-blue.svg?style=flat-square)](https://www.linkedin.com/in/blanho/)

- Copyright 2022 © [Hồ Bảo Lân](https://github.com/blanho)
