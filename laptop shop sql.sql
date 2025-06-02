-- Create Database
CREATE DATABASE LaptopShop;
USE LaptopShop;

-- 1. Users table (for customers or employees)
CREATE TABLE Users (
    UserID INT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Password VARCHAR(100) -- In a real application, passwords should be hashed
);

-- 2. Suppliers table (instead of Users for products, to represent laptop manufacturers/distributors)
CREATE TABLE Suppliers (
    SupplierID INT PRIMARY KEY,
    SupplierName VARCHAR(100),
    ContactPerson VARCHAR(100),
    Phone VARCHAR(20),
    Email VARCHAR(100)
);

-- 3. Products table (instead of Recipes)
CREATE TABLE Products (
    ProductID INT PRIMARY KEY,
    ProductName VARCHAR(100),
    Description TEXT,
    Price DECIMAL(10, 2),
    SupplierID INT,
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
);

-- 4. Components table (instead of Ingredients)
CREATE TABLE Components (
    ComponentID INT PRIMARY KEY,
    ComponentName VARCHAR(100),
    Specification VARCHAR(100), -- e.g., "8GB DDR4", "Intel Core i7-11800H"
    ProductID INT,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- 5. Categories table
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY,
    CategoryName VARCHAR(100)
);

-- 6. ProductCategories table (many-to-many relationship)
CREATE TABLE ProductCategories (
    PCID INT PRIMARY KEY,
    ProductID INT,
    CategoryID INT,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

-- Insert sample data into Users
INSERT INTO Users VALUES
(1, 'Ahmed Raza', 'ahmed@example.com', 'userpass1'),
(2, 'Sana Tariq', 'sana@example.com', 'userpass2'),
(3, 'Usman Ghani', 'usman@example.com', 'userpass3'),
(4, 'Maria Khan', 'maria@example.com', 'userpass4'),
(5, 'Faisal Butt', 'faisal@example.com', 'userpass5'),
(6, 'Aisha Siddiqui', 'aisha@example.com', 'userpass6'),
(7, 'Imran Ali', 'imran@example.com', 'userpass7'),
(8, 'Zoya Hassan', 'zoya@example.com', 'userpass8'),
(9, 'Kamran Jafri', 'kamran@example.com', 'userpass9'),
(10, 'Hina Malik', 'hina@example.com', 'userpass10');

-- Insert sample data into Suppliers
INSERT INTO Suppliers VALUES
(1, 'Dell Inc.', 'John Doe', '123-456-7890', 'john.doe@dell.com'),
(2, 'HP Inc.', 'Jane Smith', '987-654-3210', 'jane.smith@hp.com'),
(3, 'Lenovo Group Ltd.', 'Peter Jones', '555-123-4567', 'peter.jones@lenovo.com'),
(4, 'Apple Inc.', 'Sarah Brown', '111-222-3333', 'sarah.brown@apple.com'),
(5, 'ASUS Tek Inc.', 'David Lee', '444-555-6666', 'david.lee@asus.com');

-- Insert sample data into Products
INSERT INTO Products VALUES
(1, 'Dell XPS 15', 'High-performance ultrabook with stunning display', 1899.99, 1),
(2, 'HP Spectre x360', 'Premium 2-in-1 convertible laptop', 1499.99, 2),
(3, 'Lenovo ThinkPad X1 Carbon', 'Business-grade laptop, lightweight and durable', 1750.00, 3),
(4, 'MacBook Air M2', 'Ultra-portable laptop with powerful M2 chip', 1199.00, 4),
(5, 'ASUS ROG Zephyrus G14', 'Compact gaming laptop with AMD Ryzen CPU', 1650.50, 5),
(6, 'Dell Inspiron 14', 'Everyday laptop for general use', 799.00, 1),
(7, 'HP Pavilion Gaming 15', 'Mid-range gaming laptop', 950.00, 2),
(8, 'Lenovo IdeaPad Flex 5', 'Versatile 2-in-1 for productivity', 680.00, 3),
(9, 'MacBook Pro 16 M3', 'Professional laptop for creative tasks', 2499.00, 4),
(10, 'ASUS VivoBook 15', 'Affordable and stylish everyday laptop', 550.00, 5);

-- Insert sample data into Components
INSERT INTO Components VALUES
(1, 'CPU', 'Intel Core i7-13700H', 1),
(2, 'RAM', '16GB DDR5', 1),
(3, 'Storage', '1TB NVMe SSD', 1),
(4, 'CPU', 'Intel Core i7-1355U', 2),
(5, 'RAM', '16GB LPDDR5', 2),
(6, 'Storage', '512GB PCIe Gen4 SSD', 2),
(7, 'CPU', 'Intel Core i7-1260P', 3),
(8, 'RAM', '32GB LPDDR5', 3),
(9, 'Storage', '1TB SSD', 3),
(10, 'CPU', 'Apple M2', 4); -- M2 chip is a System on Chip, so CPU is sufficient for simplicity

-- Insert sample data into Categories
INSERT INTO Categories VALUES
(1, 'Ultrabook'),
(2, 'Gaming Laptop'),
(3, 'Business Laptop'),
(4, '2-in-1 Convertible'),
(5, 'Student Laptop'),
(6, 'Workstation'),
(7, 'Budget Friendly'),
(8, 'Premium'),
(9, 'Creator Laptop'),
(10, 'Everyday Use');

-- Insert sample data into ProductCategories
INSERT INTO ProductCategories VALUES
(1, 1, 1), -- Dell XPS 15 is Ultrabook
(2, 1, 8), -- Dell XPS 15 is Premium
(3, 2, 4), -- HP Spectre x360 is 2-in-1
(4, 2, 8), -- HP Spectre x360 is Premium
(5, 3, 3), -- Lenovo ThinkPad X1 Carbon is Business
(6, 3, 1), -- Lenovo ThinkPad X1 Carbon is Ultrabook
(7, 4, 1), -- MacBook Air M2 is Ultrabook
(8, 4, 5), -- MacBook Air M2 is Student
(9, 5, 2), -- ASUS ROG Zephyrus G14 is Gaming
(10, 5, 9); -- ASUS ROG Zephyrus G14 is Creator

-- Select all products to verify data
SELECT * FROM Products;
