--Create a database called LoversWatches_DB
CREATE DATABASE LoversWatches1_DB
GO

--Use LoversWatches_DB
USE LoversWatches1_DB
GO

-- Create Category Table
Create table Category
(
  Id int primary key identity,
  CatName nvarchar(50)
)
GO

--Create Product Table
Create table Product
(
  ProId int Primary Key Identity(1,1),
  ProName nvarchar(50),
  ProImage nvarchar(100),
  ProPrice decimal(18,3),
  CatId int
)
GO

-- Create Order Table
Create table [Order]
(
  OrderId int primary key identity,
  OrderName nvarchar(50),
  OrderDate date,
  PaymentType nvarchar(50),
  Status nvarchar(50),
  CustomerName nvarchar(100),
  CustomerPhone nvarchar(15),
  CustomerEmail nvarchar(100),
  CustomerAddress nvarchar(250)
)
GO

-- Create OrderDetail Table
Create table OrderDetail
(
  OrderId int,
  ProductId int,
  Price float,
  Quantity int
  Primary key(OrderId, ProductId),
  Foreign key(OrderId) references [Order](OrderId),
  Foreign key(ProductId) references Product(ProId)
)
GO

-- Create User Table
Create table [User]
(
 UserId int primary key identity(1,1),
 UserName varchar(50),
 UserPassword varchar(255)
)
GO

-- Insert some test data into Category Table
Insert into Category values('Mens')
Insert into Category values('Womens')


GO

-- Add Foreign Key into Product Table Reference to the Category Table
Alter table Product add foreign key (CatId) references Category(Id)
GO

-- Insert Some Test data into Product Table
Insert into Product values('Rolex Datejust 179173','Rolex Datejust 179173.jpg',6.260,1)
Insert into Product values('ROLEX OYSTER PERPETUAL 279138RBR-0025','ROLEX OYSTER PERPETUAL 279138RBR-0025 .jpg',45.665,1)
Insert into Product values('ROLEX OYSTER PERPETUAL 279138RBR-0020','ROLEX OYSTER PERPETUAL 279138RBR-0020 .jpg',44.406,1)
Insert into Product values('ROLEX OYSTER PERPETUAL 279138RBR-0008','ROLEX OYSTER PERPETUAL 279138RBR-0008 .jpg',49.368,1)
Insert into Product values('ROLEX OYSTER PERPETUAL 81298-0002','ROLEX OYSTER PERPETUAL 81298-0002 .jpg',66.192,1)

GO

--Create Product_Category View
Create view Product_Category as
Select ProId, ProName, ProImage, ProPrice, CatId, CatName
From Product inner join Category on Product.CatId=Category.Id
GO

Select * from Category
Select * from Product
Select * from [Order]
Select * from OrderDetail
Select * from [User]