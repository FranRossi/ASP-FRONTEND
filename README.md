# ASP-Frontend

ASP-Frontend is a React.js application based on the Minimal Dashboard Free template ([link to template](https://mui.com/store/items/minimal-dashboard-free/)). It provides a minimalistic and responsive user interface for managing products, inventory, suppliers, sales, and purchases.

## Features

- Product Management: Add, update, and remove products with images.
- Inventory Management: Track the quantity and availability of products and subscribe when stock reachs 0.
- Supplier Management: Add providers.
- Sales: Record and monitor sales transactions.
- Purchases: Manage purchase orders and inventory restocking.

## Prerequisites

Before running the ASP-Frontend application, ensure that you have the following installed:

- Node.js (version we used 19.8.1): [Installation Guide](https://nodejs.org)

## Getting Started

Follow these steps to get started with the ASP-Frontend application:

1. Clone the repository:

```shell
git clone https://github.com/FranRossi/ASP-FRONTEND.git
cd ASP-Frontend
```

2. Install the dependencies:

```shell
yarn
```

3. Set api-gateway url:

Under src/services/baseService.js
Change the value of the variable "baseURL" or leave like that if you already have the api-gateway running on localhost:3000


4. Start the application:

```shell
yarn start
```



## Usage example

After loggin in you have access to the main page, where you can see the main features of the application.

On the left you have the sidebar, where you can navigate through the different sections of the application.
<img width="271" alt="image" src="https://github.com/FranRossi/ASP-FRONTEND/assets/65981860/0318296c-d954-4b63-b94a-4c0f17a7be1f">


### Product Management

In this section you can see the list of products, add new products, edit existing products and delete products.

You have a button to add a new product, which will open a modal where you can add the product's information and upload an image.

After adding a product, you can edit, delete, subscribe or unsubscribe it by clicking on the three dots button on the right of the product's row. This will open a modal where you can perform the action you want.
<img width="1191" alt="image" src="https://github.com/FranRossi/ASP-FRONTEND/assets/65981860/aec88534-d5d2-4b1c-b704-7fcc95e65c6f">



### Inventory Management


After having a product listed, you can navigate to Inventory section, where you can see the list of products and their stock.

To subscribe to a product, you can click on the Notifi stock button on the top right section of the product card.
<img width="334" alt="image" src="https://github.com/FranRossi/ASP-FRONTEND/assets/65981860/ec43ec71-8622-40e4-af08-713dce6f28c2">


### Sales Management

To create a programmated sale you can click on the "New Sale" button on the top right section of the sales list. This will open a modal where you can select the products you want to include in the sale, the date of the sale and you must click on the "Es una venta programada" checkbox to program the sale for the future.
<img width="600" alt="image" src="https://github.com/FranRossi/ASP-FRONTEND/assets/65981860/3ea6e114-4fef-4848-a104-61ab8b7c0897">

