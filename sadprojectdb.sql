CREATE DATABASE  IF NOT EXISTS `sadprojectdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sadprojectdb`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: sadprojectdb
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `roles`
--
DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(20) NOT NULL,
  `description` text,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` 
VALUES (1,'admin','Admin role'),
(2,'staff','Staff role'),
(3, 'supplier', 'Supplier role'),
(4, 'customer', 'Customer role');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password_hash` text,
  `role_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime ,
  `is_active` tinyint(1) DEFAULT 1,
  `first_name` varchar(100),
  `last_name` varchar(100),
  `gender` varchar(10),
  `date_of_birth` date,
  `profile_image` varchar(255),
  `phone_number` varchar(20),
  `is_google_user` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` 
VALUES 
(1, 'user1', 'user1@example.com', 'hash1', 4, NOW(), NOW(), 1, 'Alice', 'Smith', 'Female', '1990-01-01', 'profile1.jpg', '1111111111', 0),
(2, 'user2', 'user2@example.com', 'hash2', 4, NOW(), NOW(), 1, 'Bob', 'Brown', 'Male', '1985-06-15', 'profile2.jpg', '1111111112', 0),
(3, 'user3', 'user3@example.com', 'hash3', 4, NOW(), NOW(), 1, 'Charlie', 'Green', 'Male', '1988-03-20', 'profile3.jpg', '1111111113', 0),
(4, 'user4', 'user4@example.com', 'hash4', 4, NOW(), NOW(), 1, 'Diana', 'Black', 'Female', '1992-07-18', 'profile4.jpg', '1111111114', 0),
(5, 'user5', 'user5@example.com', 'hash5', 4, NOW(), NOW(), 1, 'Evan', 'White', 'Male', '1983-11-22', 'profile5.jpg', '1111111115', 0),
(6, 'user6', 'user6@example.com', 'hash6', 4, NOW(), NOW(), 1, 'Fiona', 'Stone', 'Female', '1995-09-30', 'profile6.jpg', '1111111116', 0),
(7, 'user7', 'user7@example.com', 'hash7', 4, NOW(), NOW(), 1, 'George', 'Wood', 'Male', '1989-01-05', 'profile7.jpg', '1111111117', 0),
(8, 'user8', 'user8@example.com', 'hash8', 4, NOW(), NOW(), 1, 'Hannah', 'Hill', 'Female', '1991-04-12', 'profile8.jpg', '1111111118', 0),
(9, 'user9', 'user9@example.com', 'hash9', 4, NOW(), NOW(), 1, 'Ian', 'Lee', 'Male', '1987-08-08', 'profile9.jpg', '1111111119', 0),
(10, 'user10', 'user10@example.com', 'hash10', 4, NOW(), NOW(), 1, 'Jane', 'Scott', 'Female', '1986-02-26', 'profile10.jpg', '1111111120', 0),
(11, 'user11', 'user11@example.com', 'hash11', 4, NOW(), NOW(), 1, 'Kyle', 'Taylor', 'Male', '1984-10-11', 'profile11.jpg', '1111111121', 0),
(12, 'user12', 'user12@example.com', 'hash12', 4, NOW(), NOW(), 1, 'Lana', 'Perry', 'Female', '1993-05-14', 'profile12.jpg', '1111111122', 0),
(13, 'user13', 'user13@example.com', 'hash13', 4, NOW(), NOW(), 1, 'Mike', 'Reed', 'Male', '1990-03-09', 'profile13.jpg', '1111111123', 0),
(14, 'user14', 'user14@example.com', 'hash14', 4, NOW(), NOW(), 1, 'Nina', 'Cook', 'Female', '1994-06-17', 'profile14.jpg', '1111111124', 0),
(15, 'user15', 'user15@example.com', 'hash15', 4, NOW(), NOW(), 1, 'Oscar', 'Bell', 'Male', '1996-01-01', 'profile15.jpg', '1111111125', 0),
(16, 'user16', 'user16@example.com', 'hash16', 4, NOW(), NOW(), 1, 'Paula', 'Ward', 'Female', '1992-08-28', 'profile16.jpg', '1111111126', 0),
(17, 'user17', 'user17@example.com', 'hash17', 4, NOW(), NOW(), 1, 'Quinn', 'James', 'Male', '1985-12-05', 'profile17.jpg', '1111111127', 0),
(18, 'user18', 'user18@example.com', 'hash18', 4, NOW(), NOW(), 1, 'Rachel', 'Lewis', 'Female', '1987-09-13', 'profile18.jpg', '1111111128', 0),
(19, 'user19', 'user19@example.com', 'hash19', 4, NOW(), NOW(), 1, 'Steve', 'Young', 'Male', '1983-11-11', 'profile19.jpg', '1111111129', 0),
(20, 'user20', 'user20@example.com', 'hash20', 4, NOW(), NOW(), 1, 'Tina', 'Price', 'Female', '1991-10-20', 'profile20.jpg', '1111111130', 0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `complete_address` varchar(255) NOT NULL,
  `label` varchar(20) NOT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `phone_number` varchar(20) DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`address_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES 
INSERT INTO addresses (address_id, user_id, first_name, last_name, postal_code, complete_address, label, is_default, created_at, phone_number, street_address) VALUES
(1, 1, 'Alice', 'Smith', '1000', '123 Alpha Street, Zone 1', 'home', 1, NOW(), '1111111111', '123 Alpha Street'),
(2, 2, 'Bob', 'Brown', '1001', '456 Beta Road, Zone 2', 'home', 1, NOW(), '1111111112', '456 Beta Road'),
(3, 3, 'Charlie', 'Green', '1002', '789 Gamma Ave, Zone 3', 'home', 1, NOW(), '1111111113', '789 Gamma Ave'),
(4, 4, 'Diana', 'Black', '1003', '321 Delta Blvd, Zone 4', 'home', 1, NOW(), '1111111114', '321 Delta Blvd'),
(5, 5, 'Evan', 'White', '1004', '654 Epsilon Lane, Zone 5', 'home', 1, NOW(), '1111111115', '654 Epsilon Lane'),
(6, 6, 'Fiona', 'Stone', '1005', '987 Zeta Street, Zone 6', 'home', 1, NOW(), '1111111116', '987 Zeta Street'),
(7, 7, 'George', 'Wood', '1006', '159 Eta Road, Zone 7', 'home', 1, NOW(), '1111111117', '159 Eta Road'),
(8, 8, 'Hannah', 'Hill', '1007', '753 Theta Blvd, Zone 8', 'home', 1, NOW(), '1111111118', '753 Theta Blvd'),
(9, 9, 'Ian', 'Lee', '1008', '951 Iota Ave, Zone 9', 'home', 1, NOW(), '1111111119', '951 Iota Ave'),
(10, 10, 'Jane', 'Scott', '1009', '852 Kappa Lane, Zone 10', 'home', 1, NOW(), '1111111120', '852 Kappa Lane'),
(11, 11, 'Kyle', 'Taylor', '1010', '111 Lambda St, Zone 11', 'home', 1, NOW(), '1111111121', '111 Lambda St'),
(12, 12, 'Lana', 'Perry', '1011', '222 Mu Road, Zone 12', 'home', 1, NOW(), '1111111122', '222 Mu Road'),
(13, 13, 'Mike', 'Reed', '1012', '333 Nu Blvd, Zone 13', 'home', 1, NOW(), '1111111123', '333 Nu Blvd'),
(14, 14, 'Nina', 'Cook', '1013', '444 Xi Street, Zone 14', 'home', 1, NOW(), '1111111124', '444 Xi Street'),
(15, 15, 'Oscar', 'Bell', '1014', '555 Omicron Ave, Zone 15', 'home', 1, NOW(), '1111111125', '555 Omicron Ave'),
(16, 16, 'Paula', 'Ward', '1015', '666 Pi Lane, Zone 16', 'home', 1, NOW(), '1111111126', '666 Pi Lane'),
(17, 17, 'Quinn', 'James', '1016', '777 Rho St, Zone 17', 'home', 1, NOW(), '1111111127', '777 Rho St'),
(18, 18, 'Rachel', 'Lewis', '1017', '888 Sigma Blvd, Zone 18', 'home', 1, NOW(), '1111111128', '888 Sigma Blvd'),
(19, 19, 'Steve', 'Young', '1018', '999 Tau Ave, Zone 19', 'home', 1, NOW(), '1111111129', '999 Tau Ave'),
(20, 20, 'Tina', 'Price', '1019', '000 Upsilon Road, Zone 20', 'home', 1, NOW(), '1111111130', '000 Upsilon Road');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `parent_category_id` int DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  KEY `parent_category_id` (`parent_category_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES 
(1,'Sewing Machines',NULL),
(2,'Sewing Parts',NULL),
(3,'Fabrics',NULL),
(4,'Shunfa Industrial Sewing Machines',1),
(5,'Juki Sewing Machines',1),
(6,'Sewing Machine Components',2),
(7,'Sewing Machine Accessories',2),
(8,'Sewing Machine Needles',2),
(9,'Cotton Fabric',3),
(10,'Polyester-Blend Fabrics',3),
(11, 'Lacoste Fabrics', 3),
(12, 'Silk Fabrics', 3);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `model_number` varchar(50) NOT NULL,
  `description` text,
  `category_id` int NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `FULLTEXT` (product_name, description),
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `unique_product_name_model` (`product_name`,`model_number`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES 
(41,'SHUNFA SF-5550 Single Needle High-Speed Machine','SF-5550','Shunfa\'s SF-5550 is a high-speed, single needle lockstitch industrial sewing machine. It\'s ideal for garment factories, providing consistent and accurate stitching for various fabric types.',4,8450.75,0.00,50,'2025-05-16 08:23:38','2025-05-16 08:23:38',1,NULL),
(42,'SHUNFA SF-562-02BB – Piping Machine','SF-562-02BB','Shunfa SF-562-02BB is a specialized overlock machine equipped with a piping foot, suitable for sewing decorative or functional piping into garment seams.',4,8999.99,0.00,10,'2025-05-16 08:31:51','2025-05-16 08:58:27',1,NULL),
(43,'SHUNFA SF-372 – Button Sew Machine','SF-372','Shunfa SF-372 is designed for button attachment on shirts, jackets, and other garments, providing secure stitching with adjustable settings.',4,10999.00,0.00,10,'2025-05-16 09:25:46','2025-05-16 09:27:39',1,NULL),
(44,'SHUNFA SF-781 – Buttonholer Machine','SF-781','Shunfa SF-781 is an industrial buttonholer ideal for producing precise, consistent buttonholes across light to medium fabrics.',4,10999.00,0.00,10,'2025-05-16 09:32:40','2025-05-16 09:32:40',1,NULL),
(45,'SHUNFA SF-737 – 3-Thread Overlock Machine','SF-737','Shunfa SF-737 is a 3-thread overlock machine used for edge finishing and light seaming in knitted and woven fabrics.',4,10999.00,0.00,9,'2025-05-16 09:38:58','2025-05-17 07:34:41',1,NULL),
(47,'SHUNFA SF-757 – 5-Thread Overlock Machine','SF-757','Shunfa SF-757 combines overlock and safety stitching in one operation, ideal for trousers, jeans, and heavy-duty garments.',4,10999.00,0.00,10,'2025-05-16 09:39:25','2025-05-16 09:39:25',1,NULL),
(48,'SHUNFA JA2-2 – Household Sewing Machine','JA2-2','Shunfa JA2-2 is a durable household sewing machine designed for home use or small-scale tailoring, offering manual control and stable performance.',4,10999.00,0.00,10,'2025-05-16 09:39:49','2025-05-16 09:39:49',1,NULL),
(49,'SHUNFA SF-747 – 4-Thread Overlock Machine','SF-747','Shunfa SF-747 is a 4-thread overlock machine that balances seam strength and flexibility, suitable for most garment construction.',4,10999.00,0.00,10,'2025-05-16 09:47:38','2025-05-16 09:47:38',1,NULL),
(50,'Juki DDL-8100E – Single Needle High-Speed Lockstitch Machine','DDL-8100E','The Juki DDL-8100E is a high-speed, single-needle lockstitch sewing machine designed for industrial applications. It offers precise stitching and is suitable for light to medium-weight fabrics.',5,10898.00,0.00,10,'2025-05-16 10:02:14','2025-05-16 10:06:29',2,NULL),
(51,'Juki MO-6700DA Series – Semi-Dry Head Overlock Machine','MO-6700DA Series','The Juki MO-6700DA Series is a high-speed overlock machine featuring semi-dry head technology, which reduces oil stains on sewing products. It is suitable for various fabrics and offers enhanced durability.',5,8998.00,0.00,10,'2025-05-16 10:02:14','2025-05-16 10:06:29',2,NULL),
(52,'Juki W562-02BB – Piping Machine','W562-02BB','The Juki W562-02BB is a specialized piping machine designed for sewing piping into seams, commonly used in garment manufacturing for decorative or functional purposes.',5,10998.00,0.00,10,'2025-05-16 10:02:14','2025-05-16 10:06:29',2,NULL),
(53,'Juki LU-1508N – Walking Foot Lockstitch Machine','LU-1508N','The Juki LU-1508N is a walking foot lockstitch sewing machine designed for heavy-duty applications, providing consistent stitching on thick and multi-layered materials.',5,12998.00,0.00,10,'2025-05-16 10:02:15','2025-05-16 10:06:29',2,NULL),
(54,'Juki LK-1900S – Computer-Controlled Bartacking Machine','LK-1900S','The Juki LK-1900S is a computer-controlled bartacking machine designed for high-speed and high-quality bartack stitching, suitable for various garment applications.',5,11998.00,0.00,10,'2025-05-16 10:02:15','2025-05-16 10:06:29',2,NULL),
(55,'Skylab – Lacoste Fabric','Lacoste','Locally manufactured Lacoste fabric from Skylab, ideal for polo shirts and casual wear. Features a textured knit with excellent breathability and stretch.\n\nFor bulk orders, kindly send us a private message for further assistance.',11,499.00,0.00,100,'2025-05-16 10:25:08','2025-05-16 10:34:22',3,NULL),
(56,'Skylab – TR Lacoste Fabric','TR Lacoste','TR Lacoste fabric blends polyester and rayon, offering a durable and wrinkle-resistant material with a soft feel, commonly used for uniforms and corporate wear. For bulk orders, kindly send us a private message for further assistance.',11,599.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',3,NULL),
(57,'Quitalig – China Cotton 135 GSM','Cotton','Lightweight 100% cotton fabric suitable for warm climates, shirts, linings, or layering. For bulk orders, kindly send us a private message for further assistance.',9,499.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',4,NULL),
(58,'Quitalig – China Cotton 165 GSM','Cotton','Midweight cotton fabric ideal for general garments like t-shirts, dresses, and uniforms. For bulk orders, kindly send us a private message for further assistance.',9,499.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',4,NULL),
(59,'Quitalig – China Cotton 185 GSM','Cotton','Heavier cotton fabric for durable garments like workwear or outerwear with a soft, breathable feel. For bulk orders, kindly send us a private message for further assistance.',9,499.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',4,NULL),
(60,'Quitalig – China Cotton 200 GSM','Cotton','High-density cotton for structured clothing and durable garments. Excellent for embroidery. For bulk orders, kindly send us a private message for further assistance.',9,499.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',4,NULL),
(61,'Skylab – TC Fabric','TC (Tetron Cotton)','TC (Tetron Cotton) fabric combines polyester with cotton for strength, easy care, and wrinkle resistance. Common in uniforms and casual apparel. For bulk orders, kindly send us a private message for further assistance.',10,599.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',3,NULL),
(62,'Skylab – CVC Cotton Fabric','CVC','CVC (Chief Value Cotton) fabric has higher cotton content for comfort with added durability and lower shrinkage, perfect for everyday garments. For bulk orders, kindly send us a private message for further assistance.',10,599.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',3,NULL),
(63,'Skylab – Ribbings for Neckline','Ribbing','Stretchable ribbing fabric used in collars, cuffs, and hems to enhance flexibility and fit. For bulk orders, kindly send us a private message for further assistance.',11,599.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',3,NULL),
(64,'Charmeuse Silk','Charmeuse Silk','Charmeuse is a luxurious silk fabric known for its high-gloss finish and smooth texture. It is lightweight and drapes beautifully, making it ideal for elegant evening wear, lingerie, and scarves. For bulk orders, kindly send us a private message for further assistance.',12,1499.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',NULL,NULL),
(65,'Chiffon Silk','Chiffon Silk','Chiffon silk is a lightweight, sheer fabric with a soft, flowing drape. It is often used in layering garments such as dresses, blouses, and scarves, providing an airy and romantic aesthetic. For bulk orders, kindly send us a private message for further assistance.',12,1499.00,0.00,100,'2025-05-16 10:38:00','2025-05-16 10:38:00',NULL,NULL),
(66,'Crepe de Chine Silk','Crepe de Chine Silk','Crepe de Chine is a lightweight silk fabric with a soft, crinkled texture. It offers a subtle sheen and is commonly used for blouses, dresses, and scarves, providing an elegant and refined appearance. For bulk orders, kindly send us a private message for further assistance.',12,1499.00,0.00,100,'2025-05-16 10:38:00','2025-05-16 10:38:00',NULL,NULL),
(83,'Bobbin Case','B9117-012-000','The bobbin case holds the bobbin in place and ensures smooth thread flow to form stitches. For bulk orders, kindly send us a private message for further assistance.',6,120.00,NULL,50,NULL,NULL,NULL,'SewingMachineComponents'),
(84,'Bobbin','B1837-012-000','The bobbin stores the bottom thread, which works in tandem with the needle thread to form stitches. For bulk orders, kindly send us a private message for further assistance.',6,15.00,NULL,100,NULL,NULL,NULL,'SewingMachineComponents'),
(85,'Positioning Finger','B1835-012-000','The positioning finger guides the fabric through the machine to ensure alignment and prevent slippage during high-speed sewing. For bulk orders, kindly send us a private message for further assistance.',2,60.00,NULL,100,NULL,NULL,NULL,'SewingMachineComponents'),
(86,'Rotating Hook','B1830-127-000','The rotating hook picks up the top thread and loops it around the bobbin thread to create stitches. For bulk orders, kindly send us a private message for further assistance.',6,350.00,NULL,50,NULL,NULL,NULL,NULL),
(87,'Presser Foot','B3421-552-000','The presser foot holds fabric in place while stitching and applies pressure to ensure even feeding of fabric. For bulk orders, kindly send us a private message for further assistance.',6,40.00,NULL,100,NULL,NULL,NULL,NULL),
(88,'Clutch Motor for Sewing Machine','UNO Clutch Motor','The clutch motor provides the power to drive the sewing machine, essential for high-speed industrial sewing. For bulk orders, kindly send us a private message for further assistance.',7,2200.00,NULL,20,NULL,NULL,NULL,NULL),
(89,'Servo Motor for Sewing Machine','UNO Servo Motor','Servo motors offer precise speed control and are energy-efficient, providing smooth operation and reducing energy consumption. For bulk orders, kindly send us a private message for further assistance.',7,2500.00,NULL,20,NULL,NULL,NULL,NULL),
(90,'Table and Stand for Industrial Sewing Machine','VARIES','A sturdy table and stand that supports industrial sewing machines, designed for stability during high-speed sewing. For bulk orders, kindly send us a private message for further assistance.',7,3500.00,NULL,10,NULL,NULL,NULL,NULL),
(91,'Universal Needles','DBx1','Universal needles are suitable for most types of fabrics, offering reliable stitching for general purposes. For bulk orders, kindly send us a private message for further assistance.',8,10.00,NULL,200,NULL,NULL,NULL,NULL),
(92,'Ballpoint Needles','DBxK','Ballpoint needles are designed for sewing knit fabrics, preventing snags and providing smooth stitching on stretchy materials. For bulk orders, kindly send us a private message for further assistance.',8,12.00,NULL,200,NULL,NULL,NULL,NULL),
(93,'Jeans Needles','DBx1-JEANS','Jeans needles have a strong shaft and a thick, strong needle point designed specifically for sewing through heavy fabrics like denim and canvas without breaking. For bulk orders, kindly send us a private message for further assistance.',8,15.00,NULL,200,NULL,NULL,NULL,NULL),
(94,'Microtex Needles','DBx1-Microtex','Microtex needles have a very slim, sharp point designed to handle fine fabrics such as silk, tulle, or microfiber without damaging them. For bulk orders, kindly send us a private message for further assistance.',8,18.00,NULL,200,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_specifications`
--

DROP TABLE IF EXISTS `product_specifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_specifications` (
  `spec_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `spec_name` varchar(100) NOT NULL,
  `spec_value` varchar(255) NOT NULL,
  `display_order` int DEFAULT NULL,
  PRIMARY KEY (`spec_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_specifications_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=436 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_specifications`
--

LOCK TABLES `product_specifications` WRITE;
/*!40000 ALTER TABLE `product_specifications` DISABLE KEYS */;
INSERT INTO `product_specifications` VALUES 
(39,41,'Brand','Shunfa',0),
(40,41,'Model','SF-5550',1),
(41,41,'Type','Single Needle High-Speed Lockstitch',2),
(42,41,'Speed','5,000 stitches per minute',3),
(43,41,'Motor','Servo',4),(44,41,'Needle System','DBX1 (DPx16)',5),
(45,41,'Stitch Length','Up to 5mm',6),
(46,41,'Presser Foot Lift','6mm',7),
(61,42,'Brand','Shunfa',0),
(62,42,'Model','SF-562-02BB',1),
(63,42,'Type','Overlock Piping Machine',2),
(64,42,'Threads','4-thread',3),
(65,42,'Stitch Length','Up to 4mm',4),
(66,42,'Overedge Width','1.5–6mm',5),
(67,42,'Motor','550W',6),
(68,43,'Brand','Shunfa',0),
(69,43,'Model','SF-372',1),
(70,43,'Type','Button Sew Machine',2),
(71,43,'Needle System','DBx1 #11',3),
(72,43,'Stitch Type','Lockstitch',4),
(73,43,'Motor','550W',5),
(74,44,'Brand','Shunfa',0),
(75,44,'Model','SF-781',1),
(76,44,'Type','Buttonholer Machine',2),
(77,44,'Stitch Type','Buttonhole Stitch',3),
(78,44,'Needle System','DBx1 #11',4),
(79,44,'Motor','550W',5),(80,45,'Brand','Shunfa',0),
(81,45,'Model','SF-737',1),
(82,45,'Type','3-Thread Overlock Machine',2),
(83,45,'Threads','3-thread',3),
(84,45,'Stitch Length','Up to 4mm',4),
(85,45,'Overedge Width','1.5–6mm',5),
(86,45,'Motor','550W',6),
(94,47,'Brand','Shunfa',0),
(95,47,'Model','SF-757',1),
(96,47,'Type','5-Thread Overlock Machine',2),
(97,47,'Threads','5-thread',3),
(98,47,'Stitch Length','Up to 4mm',4),
(99,47,'Overedge Width','1.5–6mm',5),
(100,47,'Motor','550W',6),
(101,48,'Brand','Shunfa',0),
(102,48,'Model','JA2-2',1),
(103,48,'Type','Household Sewing Machine',2),
(104,48,'Needle System','HA x1 #11-#14',3),
(105,48,'Stitch Length','6mm',4),
(106,48,'Max Sewing Thickness','5mm',5),
(107,48,'Presser Foot Height','6mm',6),
(108,48,'Dimensions','420 × 200 × 290 mm',7),
(109,48,'Weight','11/10 kg',8),(110,48,'Motor','Manual',9),(111,49,'Brand','Shunfa',0),(112,49,'Model','SF-747',1),(113,49,'Type','4-Thread Overlock Machine',2),(114,49,'Threads','4-thread',3),(115,49,'Stitch Length','Up to 4mm',4),(116,49,'Overedge Width','1.5–6mm',5),(117,49,'Motor','550W',6),(118,50,'Brand','Juki',0),(119,50,'Model','DDL-8100E',1),(120,50,'Type','Single Needle High-Speed Lockstitch',2),(121,50,'Speed','4,500 stitches per minute',3),(122,50,'Stitch Length','Up to 5mm',4),(123,50,'Needle System','DB×1 #9–#18',5),(124,50,'Motor','Servo motor',6),(125,50,'Weight','26kg',7),(126,51,'Brand','Juki',0),(127,51,'Model','MO-6700DA Series',1),(128,51,'Type','Overlock / Safety Stitch',2),(129,51,'Speed','7,000 stitches per minute',3),(130,51,'Stitch Length','0.8–4mm',4),(131,51,'Needle System','DC×27',5),(132,51,'Differential Feed Ratio','Gathering 1:2 (max. 1:4), Stretching 1:0.7 (max. 1:0.6)',6),(133,51,'Overedging Width','1.6, 3.2, 4.0, 4.8mm',7),(134,51,'Weight','28kg',8),(135,52,'Brand','Juki',0),(136,52,'Model','W562-02BB',1),(137,52,'Type','Piping Machine',2),(138,52,'Threads','4-thread',3),(139,52,'Stitch Length','Up to 4mm',4),(140,52,'Overedge Width','1.5–6mm',5),(141,52,'Motor','550W',6),(142,53,'Brand','Juki',0),(143,53,'Model','LU-1508N',1),(144,53,'Type','Walking Foot Lockstitch',2),(145,53,'Speed','2,000 stitches per minute',3),(146,53,'Stitch Length','Up to 9mm',4),(147,53,'Needle System','DP×17 #22–#27',5),(148,53,'Motor','Servo motor',6),(149,53,'Weight','70kg',7),(150,54,'Brand','Juki',0),(151,54,'Model','LK-1900S',1),(152,54,'Type','Computer-Controlled Bartacking',2),(153,54,'Speed','3,200 stitches per minute',3),(154,54,'Stitch Length','0.1–10mm',4),(155,54,'Needle System','DP×5 (#14)',5),(156,54,'Motor','Compact AC servo motor',6),(157,54,'Weight','47.1kg',7),(158,55,'Brand','Skylab',0),(159,55,'Fabric Type','Lacoste',1),(160,55,'Composition','Cotton or CVC (Cotton-Poly Blend)',2),(161,55,'Texture','Piqué knit',3),(162,55,'Use','Polo shirts, casual tops',4),(163,55,'Color','White / Black / Navy / pwede mag add pa mas maganda',5),(164,55,'Width','1.2m / 1.5m',6),(165,56,'Brand','Skylab',0),(166,56,'Fabric Type','TR Lacoste',1),(167,56,'Composition','Polyester + Rayon',2),(168,56,'Texture','Piqué knit',3),(169,56,'Use','Uniforms, casual wear',4),(170,56,'Color Options','Red, Navy',5),(171,56,'Width Options','1.2m, 1.5m',6),(172,57,'Brand','Quitalig',0),(173,57,'Fabric Type','Cotton',1),(174,57,'Composition','100% Cotton',2),(175,57,'GSM','135',3),(176,57,'Use','Shirts, linings',4),(177,57,'Color Options','Blue, Red, Black',5),(178,57,'Width Options','1.2m, 1.5m',6),(179,58,'Brand','Quitalig',0),(180,58,'Fabric Type','Cotton',1),(181,58,'Composition','100% Cotton',2),(182,58,'GSM','165',3),(183,58,'Use','T-shirts, uniforms',4),(184,58,'Color Options','Gray, Black, White',5),(185,58,'Width Options','1.2m, 1.5m',6),(186,59,'Brand','Quitalig',0),(187,59,'Fabric Type','Cotton',1),(188,59,'Composition','100% Cotton',2),(189,59,'GSM','185',3),(190,59,'Use','Polo shirts, jackets',4),(191,59,'Color Options','Red, Blue, White',5),(192,59,'Width Options','1.2m, 1.5m',6),(193,60,'Brand','Quitalig',0),(194,60,'Fabric Type','Cotton',1),(195,60,'Composition','100% Cotton',2),(196,60,'GSM','200',3),(197,60,'Use','Workwear, embroidery',4),(198,60,'Color Options','Black, Navy, White',5),(199,60,'Width Options','1.2m, 1.5m',6),(200,61,'Brand','Skylab',0),(201,61,'Fabric Type','TC (Tetron Cotton)',1),(202,61,'Composition','65% Polyester, 35% Cotton',2),(203,61,'GSM','Approx. 150–180',3),(204,61,'Use','Uniforms, shirts',4),(205,61,'Color Options','Red, Blue, Gray',5),(206,61,'Width Options','1.2m, 1.5m',6),(207,62,'Brand','Skylab',0),(208,62,'Fabric Type','CVC',1),(209,62,'Composition','60% Cotton, 40% Polyester',2),(210,62,'GSM','Approx. 160–200',3),(211,62,'Use','T-shirts, uniforms',4),(212,62,'Color Options','Red, Blue, Gray',5),(213,62,'Width Options','1.2m, 1.5m',6),(214,63,'Brand','Skylab',0),(215,63,'Fabric Type','Ribbing',1),(216,63,'Composition','Cotton + Spandex blend',2),(217,63,'Use','Necklines, cuffs, hems',3),(218,63,'Color Options','Black, White, Navy',4),(219,63,'Width Options','1.0m, 1.5m',5),(220,64,'Fabric Type','Charmeuse Silk',0),(221,64,'Composition','100% Mulberry Silk',1),(222,64,'Weight','85 GSM',2),(223,64,'Width','44 inches',3),(224,64,'Use','Evening wear, lingerie, scarves',4),(225,64,'Silk Type Options','Pure Charmeuse Silk, Charmeuse Silk Blend',5),(226,64,'Color Options','Ivory, Champagne, Black',6),(227,64,'Width Options','0.9m, 1.5m',7),(228,65,'Fabric Type','Chiffon Silk',0),(229,65,'Composition','100% Mulberry Silk',1),(230,65,'Weight','29–34 GSM',2),(231,65,'Width','44–54 inches',3),(232,65,'Use','Dresses, blouses, scarves',4),(233,65,'Silk Type Options','Pure Charmeuse Silk, Charmeuse Silk Blend',5),(234,65,'Color Options','Ivory, Champagne, Black',6),(235,65,'Width Options','0.9m, 1.5m',7),(236,66,'Fabric Type','Crepe de Chine Silk',0),(237,66,'Composition','100% Mulberry Silk',1),(238,66,'Weight','45–60 GSM',2),(239,66,'Width','44 inches',3),(240,66,'Use','Blouses, dresses, scarves',4),(241,66,'Silk Type Options','Pure Crepe de Chine Silk, Crepe de Chine Silk Blend',5),(242,66,'Color Options','Champagne, Black, Navy',6),(243,66,'Width Options','0.9m, 1.5m',7),(340,83,'Part Number','B9117-012-000',0),(341,83,'Material','Stainless Steel',1),(342,83,'Compatibility','Compatible with various Shunfa and industrial machines',2),(343,83,'Use','Holds bobbin for smooth thread operation',3),(344,83,'Material Type','Stainless Steel',4),(345,83,'Size','Standard',5),(346,83,'Size','Large',6),(347,84,'Part Number','B1837-012-000',0),(348,84,'Material','Metal or Plastic',1),(349,84,'Compatibility','Compatible with Shunfa and similar industrial machines',2),(350,84,'Use','Stores the bottom thread for consistent stitching',3),(351,84,'Material Type','Metal',4),(352,84,'Size','Small',5),(353,84,'Size','Medium',6),(354,84,'Size','Large',7),(355,85,'Part Number','B1835-012-000',0),(356,85,'Material','Steel',1),(357,85,'Compatibility','Compatible with Shunfa industrial sewing machines',2),(358,85,'Use','Positions fabric for accurate stitching',3),(359,85,'Material','Steel',4),(360,85,'Material','Alloy',5),(361,85,'Size','Standard',6),(362,86,'Part Number','B1830-127-000',0),(363,86,'Material','High-strength steel',1),(364,86,'Compatibility','Shunfa, Juki, and other lockstitch machines',2),(365,86,'Use','Forms stitches by looping thread',3),(366,86,'Material','Steel',4),(367,86,'Material','Alloy',5),(368,87,'Part Number','B3421-552-000',0),(369,87,'Material','Steel or Plastic',1),(370,87,'Compatibility','Shunfa, Juki, and other industrial machines',2),(371,87,'Use','Holds fabric in place for consistent stitching',3),(372,87,'Material','Steel',4),(373,87,'Material','Plastic',5),(374,88,'Part Number','UNO Clutch Motor',0),(375,88,'Power','750W–1000W',1),(376,88,'Speed','2,500–3,000 RPM',2),(377,88,'Compatibility','Compatible with various industrial sewing machines',3),(378,88,'Use','Powers sewing machine for high-speed operation',4),(379,88,'Power','750W',5),(380,88,'Power','1000W',6),(381,88,'Speed Control','Fixed Speed',7),(382,89,'Part Number','UNO Servo Motor',0),(383,89,'Power','Typically 550W',1),(384,89,'Speed Control','Adjustable',2),(385,89,'Compatibility','Fits most industrial sewing machines',3),(386,89,'Use','Powers sewing machine with energy-efficient control',4),(387,89,'Power','550W',5),(388,90,'Part Number','VARIES',0),(389,90,'Material','Steel Frame, Laminate Surface',1),(390,90,'Compatibility','Compatible with Shunfa, Juki, and other industrial machines',2),(391,90,'Use','Supports the sewing machine during operations',3),(392,90,'Table Size','Standard',4),(393,90,'Frame Material','Steel Frame',5),(394,91,'Part Number','DBx1',0),(395,91,'Needle Size','#9 to #18',1),(396,91,'Material','Steel',2),(397,91,'Compatibility','Works with most sewing machines',3),(398,91,'Use','General-purpose needle for various fabrics',4),(399,91,'Needle Size','#9',5),(400,91,'Needle Size','#10',6),(401,91,'Needle Size','#12',7),(402,91,'Needle Size','#14',8),(403,91,'Needle Size','#16',9),(404,91,'Needle Size','#18',10),(405,91,'Material','Steel',11),(406,91,'Material','Titanium Coated',12),(407,92,'Part Number','DBxK',0),(408,92,'Needle Size','#11 to #16',1),(409,92,'Material','Steel with Ballpoint tip',2),(410,92,'Compatibility','Compatible with most industrial machines',3),(411,92,'Use','For knit fabrics, jerseys, and stretch fabrics',4),(412,92,'Needle Size','#11',5),(413,92,'Needle Size','#14',6),(414,92,'Needle Size','#16',7),(415,92,'Material','Steel',8),(416,92,'Material','Titanium Coated',9),(417,93,'Part Number','DBx1-JEANS',0),(418,93,'Needle Size','#16 to #18',1),(419,93,'Material','Steel with reinforced shaft',2),(420,93,'Compatibility','Works with most sewing machines',3),(421,93,'Use','For heavy fabrics such as denim, canvas, and thick upholstery materials',4),(422,93,'Needle Size','#16',5),(423,93,'Needle Size','#18',6),(424,93,'Material','Steel',7),(425,93,'Material','Titanium Coated',8),(426,94,'Part Number','DBx1-Microtex',0),(427,94,'Needle Size','#9 to #11',1),(428,94,'Material','Steel with a slim, tapered point',2),(429,94,'Compatibility','Compatible with most industrial and domestic sewing machines',3),(430,94,'Use','For fine fabrics like silk, satin, and microfibers',4),(431,94,'Needle Size','#9',5),(432,94,'Needle Size','#10',6),(433,94,'Needle Size','#11',7),(434,94,'Material','Steel',8),
(435,94,'Material','Titanium Coated',9);
/*!40000 ALTER TABLE `product_specifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `image_type` varchar(50) NOT NULL,
  `display_order` int NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`image_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` 
VALUES 
(8,43,'/static/pictures/SHUNFA SF-372 Buttonsew machine.jpg','main',0,'SHUNFA SF-372 - Button Sew Machine'),
(9,44,'/static/pictures/SHUNFA SF-781 Buttonholer machine.jpg','main',0,'SHUNFA SF-781 - Buttonholer Machine'),
(10,45,'/static/pictures/SHUNFA SF-737 – 3-Thread Overlock Machine.jpg','main',0,'SHUNFA SF-737 - 3-Thread Overlock Machine'),
(12,47,'/static/pictures/SHUNFA SF-757 – 5-Thread Overlock Machine.jpg','main',0,'SHUNFA SF-757 – 5-Thread Overlock Machine'),
(13,48,'/static/pictures/SHUNFA JA2-2 – Household Sewing Machine.jpg','main',0,'SHUNFA JA2-2 – Household Sewing Machine'),
(14,49,'/static/pictures/SHUNFA SF-747 – 4-Thread Overlock Machine.jpg','main',0,'SHUNFA SF-747 – 4-Thread Overlock Machine'),
(15,50,'/static/pictures/Juki DDL-8100E – Single Needle High-Speed Lockstitch Machine.jpg','main',0,'Juki DDL-8100E – Single Needle High-Speed Lockstitch Machine'),
(16,51,'/static/pictures/Juki MO-6700DA Series – Semi-Dry Head Overlock Machine.jpg','main',0,'Juki MO-6700DA Series – Semi-Dry Head Overlock Machine'),
(17,52,'/static/pictures/Juki W562-02BB – Piping Machine.jpg','main',0,'Juki W562-02BB – Piping Machine'),
(18,53,'/static/pictures/Juki LU-1508N – Walking Foot Lockstitch Machine.jpg','main',0,'Juki LU-1508N – Walking Foot Lockstitch Machine'),
(19,54,'/static/pictures/Juki LK-1900S – Computer-Controlled Bartacking Machine.jpg','main',0,'Juki LK-1900S – Computer-Controlled Bartacking Machine'),
(20,55,'/static/pictures/Skylab – Lacoste Fabric.jpg','main',0,'Skylab – Lacoste Fabric'),
(22,57,'/static/pictures/Quitalig – China Cotton 135 GSM.jpg','main',0,'Quitalig – China Cotton 135 GSM'),
(23,58,'/static/pictures/Quitalig – China Cotton 165 GSM.png','main',0,'Quitalig – China Cotton 165 GSM'),
(24,59,'/static/pictures/Quitalig – China Cotton 185 GSM.png','main',0,'Quitalig – China Cotton 185 GSM'),
(25,60,'/static/pictures/Quitalig – China Cotton 200 GSM.png','main',0,'Quitalig – China Cotton 200 GSM'),
(27,62,'/static/pictures/Skylab – CVC Cotton Fabric.jpg','main',0,'Skylab – CVC Cotton Fabric'),
(130,83,'/static/pictures/B9117-012-000.jpg','main',0,'Bobbin Case'),
(131,84,'/static/pictures/B1837-012-000.jpg','main',0,'Bobbin'),
(132,85,'/static/pictures/B1835-012-000.jpg','main',0,'Positioning Finger'),
(133,86,'/static/pictures/B1830-127-000.jpg','main',0,'Rotating Hook'),
(134,87,'/static/pictures/B3421-552-000.png','main',0,'Presser Foot'),
(139,41,'/static/pictures/SHUNFA SF-5550 Single Needle High-Speed Machine (2).jpg','main',1,'SHUNFA SF-5550 Single Needle High-Speed Machine'),
(140,41,'/static/pictures/SHUNFA SF-5550 Single Needle High-Speed Machine.jpg','gallery',2,'SHUNFA SF-5550 Single Needle High-Speed Machine'), 
(141, 65, '/static/pictures/chiffon-fabric.jpeg', 'main', 0, null);

/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `variant_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `variant_name` varchar(100) NOT NULL,
  `variant_value` varchar(100) NOT NULL,
  `additional_price` decimal(10,2) DEFAULT '0.00',
  `stock_quantity` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`variant_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES 
(1, 55, 'Color', 'Red', 0.00, 50, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(2, 55, 'Color', 'Blue', 0.00, 50, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(3, 55, 'Size', '1.2m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(4, 55, 'Size', '1.5m', 50.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(5, 83, 'Material', 'Stainless Steel', 0.00, 100, NOW(), NOW()),
(6, 83, 'Size', 'Standard', 0.00, 100, NOW(), NOW()),
(7, 83, 'Size', 'Large', 0.00, 100, NOW(), NOW()),
(8, 84, 'Material', 'Metal', 0.00, 100, NOW(), NOW()),
(9, 84, 'Size', 'Small', 0.00, 100, NOW(), NOW()),
(10, 84, 'Size', 'Medium', 0.00, 100, NOW(), NOW()),
(11, 84, 'Size', 'Large', 0.00, 100, NOW(), NOW()),
(12, 85, 'Material', 'Steel', 0.00, 100, NOW(), NOW()),
(13, 85, 'Material', 'Alloy', 0.00, 100, NOW(), NOW()),
(14, 85, 'Size', 'Standard', 0.00, 100, NOW(), NOW()),
(15, 86, 'Material', 'Steel', 0.00, 100, NOW(), NOW()),
(16, 86, 'Material', 'Alloy', 0.00, 100, NOW(), NOW()),
(17, 87, 'Material', 'Steel', 0.00, 100, NOW(), NOW()),
(18, 87, 'Material', 'Plastic', 0.00, 100, NOW(), NOW()),
(19, 88, 'Power', '750W', 0.00, 50, NOW(), NOW()),
(20, 88, 'Power', '1000W', 0.00, 50, NOW(), NOW()),
(21, 89, 'Power', '550W', 0.00, 50, NOW(), NOW()),
(22, 90, 'Size', 'Standard', 0.00, 30, NOW(), NOW()),
(23, 91, 'Needle Size', '#9', 0.00, 200, NOW(), NOW()),
(24, 91, 'Needle Size', '#10', 0.00, 200, NOW(), NOW()),
(25, 91, 'Needle Size', '#12', 0.00, 200, NOW(), NOW()),
(26, 91, 'Needle Size', '#14', 0.00, 200, NOW(), NOW()),
(27, 91, 'Needle Size', '#16', 0.00, 200, NOW(), NOW()),
(28, 91, 'Needle Size', '#18', 0.00, 200, NOW(), NOW()),
(29, 91, 'Material', 'Steel', 0.00, 200, NOW(), NOW()),
(30, 91, 'Material', 'Titanium Coated', 0.50, 200, NOW(), NOW()),
(31, 92, 'Needle Size', '#11', 0.00, 200, NOW(), NOW()),
(32, 92, 'Needle Size', '#14', 0.00, 200, NOW(), NOW()),
(33, 92, 'Needle Size', '#16', 0.00, 200, NOW(), NOW()),
(34, 92, 'Material', 'Steel', 0.00, 200, NOW(), NOW()),
(35, 92, 'Material', 'Titanium Coated', 0.50, 200, NOW(), NOW()),
(36, 93, 'Needle Size', '#16', 0.00, 200, NOW(), NOW()),
(37, 93, 'Needle Size', '#18', 0.00, 200, NOW(), NOW()),
(38, 93, 'Material', 'Steel', 0.00, 200, NOW(), NOW()),
(39, 93, 'Material', 'Titanium Coated', 0.50, 200, NOW(), NOW()),
(40, 94, 'Needle Size', '#9', 0.00, 200, NOW(), NOW()),
(41, 94, 'Needle Size', '#10', 0.00, 200, NOW(), NOW()),
(42, 94, 'Needle Size', '#11', 0.00, 200, NOW(), NOW()),
(43, 94, 'Material', 'Steel', 0.00, 200, NOW(), NOW()),
(44, 94, 'Material', 'Titanium Coated', 0.50, 200, NOW(), NOW());
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_promotions`
--

DROP TABLE IF EXISTS `product_promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_promotions` (
  `promotion_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `promotion_name` varchar(100) NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`promotion_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_promotions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `product_promotions` WRITE;
/*!40000 ALTER TABLE `product_promotions` DISABLE KEYS */;
INSERT INTO `product_promotions` VALUES 
(1, 41, 'Summer Sale', 15.00, '2025-06-01 00:00:00', '2025-06-30 23:59:59', 1, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(2, 55, 'Fabric Discount', 10.00, '2025-05-20 00:00:00', '2025-05-25 23:59:59', 1, '2025-05-18 14:00:00', '2025-05-18 14:00:00');
/*!40000 ALTER TABLE `product_promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_statuses`
--

DROP TABLE IF EXISTS `orders_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders_statuses` (
  `status_id` int NOT NULL AUTO_INCREMENT,
  `status_name` varchar(20) NOT NULL UNIQUE,
  `description` text,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `orders_statuses` WRITE;
/*!40000 ALTER TABLE `orders_statuses` DISABLE KEYS */;
INSERT INTO `orders_statuses` VALUES 
(1, 'To Pay', 'The order has not been paid for yet.'),
(2, 'To Ship', 'The order has not been shipped yet.'),
(3, 'To Receive', 'The order has not been received yet.'),
(4, 'Completed', 'The order has been completed.'),
(5, 'Cancelled', 'The order has been cancelled.'),
(6, 'Refunded', 'The order has been refunded.'),
(7, 'Returned', 'The order has been returned.');
/*!40000 ALTER TABLE `orders_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `cancellation_id` int,
  `order_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `total_amount` float NOT NULL,
  `shipping_address_id` int NOT NULL,
  `status_id` int NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `status_id` (`status_id`),
  KEY `cancellation_id` (`cancellation_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`shipping_address_id`) REFERENCES `addresses` (`address_id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `orders_statuses` (`status_id`),
  CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`cancellation_id`) REFERENCES `order_cancellation` (`cancellation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES 
-- User 1 Orders (10+)
(1, 1, NULL, '2025-03-01 10:00:00', 8450.75, 1, 4, NOW(), NOW()),
(2, 1, NULL, '2025-03-15 11:00:00', 8999.99, 1, 4, NOW(), NOW()),
(3, 1, NULL, '2025-03-30 12:00:00', 10999.00, 1, 4, NOW(), NOW()),
(4, 1, NULL, '2025-04-05 13:00:00', 10999.00, 1, 4, NOW(), NOW()),
(5, 1, NULL, '2025-04-20 14:00:00', 10999.00, 1, 4, NOW(), NOW()),
(6, 1, NULL, '2025-05-01 15:00:00', 10898.00, 1, 4, NOW(), NOW()),
(7, 1, NULL, '2025-05-10 16:00:00', 8998.00, 1, 4, NOW(), NOW()),
(8, 1, NULL, '2025-05-15 17:00:00', 10998.00, 1, 4, NOW(), NOW()),
(9, 1, NULL, '2025-05-20 18:00:00', 12998.00, 1, 4, NOW(), NOW()),
(10, 1, NULL, '2025-05-25 19:00:00', 11998.00, 1, 4, NOW(), NOW()),
(11, 1, NULL, '2025-05-28 20:00:00', 499.00, 1, 4, NOW(), NOW()),
(12, 1, NULL, '2025-05-30 21:00:00', 599.00, 1, 4, NOW(), NOW()),

-- User 2 Orders (10+)
(13, 2, NULL, '2025-03-05 10:00:00', 8450.75, 2, 4, NOW(), NOW()),
(14, 2, NULL, '2025-03-20 11:00:00', 8999.99, 2, 4, NOW(), NOW()),
(15, 2, NULL, '2025-04-01 12:00:00', 10999.00, 2, 4, NOW(), NOW()),
(16, 2, NULL, '2025-04-15 13:00:00', 10999.00, 2, 4, NOW(), NOW()),
(17, 2, NULL, '2025-04-30 14:00:00', 10999.00, 2, 4, NOW(), NOW()),
(18, 2, NULL, '2025-05-05 15:00:00', 10898.00, 2, 4, NOW(), NOW()),
(19, 2, NULL, '2025-05-12 16:00:00', 8998.00, 2, 4, NOW(), NOW()),
(20, 2, NULL, '2025-05-18 17:00:00', 10998.00, 2, 4, NOW(), NOW()),
(21, 2, NULL, '2025-05-22 18:00:00', 12998.00, 2, 4, NOW(), NOW()),
(22, 2, NULL, '2025-05-26 19:00:00', 11998.00, 2, 4, NOW(), NOW()),
(23, 2, NULL, '2025-05-29 20:00:00', 499.00, 2, 4, NOW(), NOW()),
(24, 2, NULL, '2025-05-31 21:00:00', 599.00, 2, 4, NOW(), NOW()),

-- User 3 Orders (10+)
(25, 3, NULL, '2025-03-10 10:00:00', 8450.75, 3, 4, NOW(), NOW()),
(26, 3, NULL, '2025-03-25 11:00:00', 8999.99, 3, 4, NOW(), NOW()),
(27, 3, NULL, '2025-04-10 12:00:00', 10999.00, 3, 4, NOW(), NOW()),
(28, 3, NULL, '2025-04-25 13:00:00', 10999.00, 3, 4, NOW(), NOW()),
(29, 3, NULL, '2025-05-02 14:00:00', 10999.00, 3, 4, NOW(), NOW()),
(30, 3, NULL, '2025-05-08 15:00:00', 10898.00, 3, 4, NOW(), NOW()),
(31, 3, NULL, '2025-05-14 16:00:00', 8998.00, 3, 4, NOW(), NOW()),
(32, 3, NULL, '2025-05-19 17:00:00', 10998.00, 3, 4, NOW(), NOW()),
(33, 3, NULL, '2025-05-24 18:00:00', 12998.00, 3, 4, NOW(), NOW()),
(34, 3, NULL, '2025-05-27 19:00:00', 11998.00, 3, 4, NOW(), NOW()),
(35, 3, NULL, '2025-05-29 20:00:00', 499.00, 3, 4, NOW(), NOW()),
(36, 3, NULL, '2025-05-31 21:00:00', 599.00, 3, 4, NOW(), NOW()),

-- User 4 Orders (10+)
(37, 4, NULL, '2025-03-15 10:00:00', 8450.75, 4, 4, NOW(), NOW()),
(38, 4, NULL, '2025-03-31 11:00:00', 8999.99, 4, 4, NOW(), NOW()),
(39, 4, NULL, '2025-04-15 12:00:00', 10999.00, 4, 4, NOW(), NOW()),
(40, 4, NULL, '2025-04-30 13:00:00', 10999.00, 4, 4, NOW(), NOW()),
(41, 4, NULL, '2025-05-03 14:00:00', 10999.00, 4, 4, NOW(), NOW()),
(42, 4, NULL, '2025-05-09 15:00:00', 10898.00, 4, 4, NOW(), NOW()),
(43, 4, NULL, '2025-05-15 16:00:00', 8998.00, 4, 4, NOW(), NOW()),
(44, 4, NULL, '2025-05-20 17:00:00', 10998.00, 4, 4, NOW(), NOW()),
(45, 4, NULL, '2025-05-25 18:00:00', 12998.00, 4, 4, NOW(), NOW()),
(46, 4, NULL, '2025-05-28 19:00:00', 11998.00, 4, 4, NOW(), NOW()),
(47, 4, NULL, '2025-05-30 20:00:00', 499.00, 4, 4, NOW(), NOW()),
(48, 4, NULL, '2025-05-31 21:00:00', 599.00, 4, 4, NOW(), NOW());

-- Continue pattern for remaining users (5-20)
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES 
-- User 1 Order Items
(1, 1, 41, 1, 1, 8450.75, 0.00),
(2, 2, 42, 2, 1, 8999.99, 0.00),
(3, 3, 43, 3, 1, 10999.00, 0.00),
(4, 4, 44, 4, 1, 10999.00, 0.00),
(5, 5, 45, 5, 1, 10999.00, 0.00),
(6, 6, 50, 6, 1, 10898.00, 0.00),
(7, 7, 51, 7, 1, 8998.00, 0.00),
(8, 8, 52, 8, 1, 10998.00, 0.00),
(9, 9, 53, 9, 1, 12998.00, 0.00),
(10, 10, 54, 10, 1, 11998.00, 0.00),
(11, 11, 55, 11, 1, 499.00, 0.00),
(12, 12, 56, 12, 1, 599.00, 0.00),

-- User 2 Order Items
(13, 13, 41, 1, 1, 8450.75, 0.00),
(14, 14, 42, 2, 1, 8999.99, 0.00),
(15, 15, 43, 3, 1, 10999.00, 0.00),
(16, 16, 44, 4, 1, 10999.00, 0.00),
(17, 17, 45, 5, 1, 10999.00, 0.00),
(18, 18, 50, 6, 1, 10898.00, 0.00),
(19, 19, 51, 7, 1, 8998.00, 0.00),
(20, 20, 52, 8, 1, 10998.00, 0.00),
(21, 21, 53, 9, 1, 12998.00, 0.00),
(22, 22, 54, 10, 1, 11998.00, 0.00),
(23, 23, 55, 11, 1, 499.00, 0.00),
(24, 24, 56, 12, 1, 599.00, 0.00),

-- Continue pattern for remaining users (3-20)
(25, 25, 41, 1, 1, 8450.75, 0.00),
(26, 26, 42, 2, 1, 8999.99, 0.00),
(27, 27, 43, 3, 1, 10999.00, 0.00),
(28, 28, 44, 4, 1, 10999.00, 0.00),
(29, 29, 45, 5, 1, 10999.00, 0.00),
(30, 30, 50, 6, 1, 10898.00, 0.00),
(31, 31, 51, 7, 1, 8998.00, 0.00),
(32, 32, 52, 8, 1, 10998.00, 0.00),
(33, 33, 53, 9, 1, 12998.00, 0.00),
(34, 34, 54, 10, 1, 11998.00, 0.00),
(35, 35, 55, 11, 1, 499.00, 0.00),
(36, 36, 56, 12, 1, 599.00, 0.00);

-- Continue pattern for remaining users (4-20)
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES 
-- User 1 Payments
(1, 1, 1, 3, '2025-03-01 10:00:00', '/static/payments/payment1.jpg', 'completed', 'REF001'),
(2, 2, 1, 2, '2025-03-15 11:00:00', '/static/payments/payment2.jpg', 'completed', 'REF002'),
(3, 3, 1, 1, '2025-03-30 12:00:00', '/static/payments/payment3.jpg', 'completed', 'REF003'),
(4, 4, 1, 3, '2025-04-05 13:00:00', '/static/payments/payment4.jpg', 'completed', 'REF004'),
(5, 5, 1, 2, '2025-04-20 14:00:00', '/static/payments/payment5.jpg', 'completed', 'REF005'),
(6, 6, 1, 1, '2025-05-01 15:00:00', '/static/payments/payment6.jpg', 'completed', 'REF006'),
(7, 7, 1, 3, '2025-05-10 16:00:00', '/static/payments/payment7.jpg', 'completed', 'REF007'),
(8, 8, 1, 2, '2025-05-15 17:00:00', '/static/payments/payment8.jpg', 'completed', 'REF008'),
(9, 9, 1, 1, '2025-05-20 18:00:00', '/static/payments/payment9.jpg', 'completed', 'REF009'),
(10, 10, 1, 3, '2025-05-25 19:00:00', '/static/payments/payment10.jpg', 'completed', 'REF010'),
(11, 11, 1, 2, '2025-05-28 20:00:00', '/static/payments/payment11.jpg', 'completed', 'REF011'),
(12, 12, 1, 1, '2025-05-30 21:00:00', '/static/payments/payment12.jpg', 'completed', 'REF012'),

-- User 2 Payments
(13, 13, 2, 3, '2025-03-05 10:00:00', '/static/payments/payment13.jpg', 'completed', 'REF013'),
(14, 14, 2, 2, '2025-03-20 11:00:00', '/static/payments/payment14.jpg', 'completed', 'REF014'),
(15, 15, 2, 1, '2025-04-01 12:00:00', '/static/payments/payment15.jpg', 'completed', 'REF015'),
(16, 16, 2, 3, '2025-04-15 13:00:00', '/static/payments/payment16.jpg', 'completed', 'REF016'),
(17, 17, 2, 2, '2025-04-30 14:00:00', '/static/payments/payment17.jpg', 'completed', 'REF017'),
(18, 18, 2, 1, '2025-05-05 15:00:00', '/static/payments/payment18.jpg', 'completed', 'REF018'),
(19, 19, 2, 3, '2025-05-12 16:00:00', '/static/payments/payment19.jpg', 'completed', 'REF019'),
(20, 20, 2, 2, '2025-05-18 17:00:00', '/static/payments/payment20.jpg', 'completed', 'REF020'),
(21, 21, 2, 1, '2025-05-22 18:00:00', '/static/payments/payment21.jpg', 'completed', 'REF021'),
(22, 22, 2, 3, '2025-05-26 19:00:00', '/static/payments/payment22.jpg', 'completed', 'REF022'),
(23, 23, 2, 2, '2025-05-29 20:00:00', '/static/payments/payment23.jpg', 'completed', 'REF023'),
(24, 24, 2, 1, '2025-05-31 21:00:00', '/static/payments/payment24.jpg', 'completed', 'REF024');

-- Continue pattern for remaining users (3-20)
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES 
-- User 1 Sales
(1, 1, 41, 1, '2025-05-01 10:00:00', 8450.75, 1),
(2, 2, 42, 1, '2025-05-02 11:00:00', 8999.99, 2),
(3, 3, 43, 1, '2025-05-03 12:00:00', 10999.00, 3),
(4, 4, 44, 1, '2025-05-04 13:00:00', 10999.00, 4),
(5, 5, 45, 1, '2025-05-05 14:00:00', 10999.00, 5),
(6, 6, 50, 1, '2025-05-06 15:00:00', 10898.00, 6),
(7, 7, 51, 1, '2025-05-07 16:00:00', 8998.00, 7),
(8, 8, 52, 1, '2025-05-08 17:00:00', 10998.00, 8),
(9, 9, 53, 1, '2025-05-09 18:00:00', 12998.00, 9),
(10, 10, 54, 1, '2025-05-10 19:00:00', 11998.00, 10),
(11, 11, 55, 1, '2025-05-11 20:00:00', 499.00, 11),
(12, 12, 56, 1, '2025-05-12 21:00:00', 599.00, 12),

-- User 2 Sales
(13, 13, 41, 2, '2025-05-01 10:00:00', 8450.75, 13),
(14, 14, 42, 2, '2025-05-02 11:00:00', 8999.99, 14),
(15, 15, 43, 2, '2025-05-03 12:00:00', 10999.00, 15),
(16, 16, 44, 2, '2025-05-04 13:00:00', 10999.00, 16),
(17, 17, 45, 2, '2025-05-05 14:00:00', 10999.00, 17),
(18, 18, 50, 2, '2025-05-06 15:00:00', 10898.00, 18),
(19, 19, 51, 2, '2025-05-07 16:00:00', 8998.00, 19),
(20, 20, 52, 2, '2025-05-08 17:00:00', 10998.00, 20),
(21, 21, 53, 2, '2025-05-09 18:00:00', 12998.00, 21),
(22, 22, 54, 2, '2025-05-10 19:00:00', 11998.00, 22),
(23, 23, 55, 2, '2025-05-11 20:00:00', 499.00, 23),
(24, 24, 56, 2, '2025-05-12 21:00:00', 599.00, 24);

-- Continue pattern for remaining users (3-20)
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES 
-- Product 41 Reviews
(1, 41, 1, 1, 5, 'Excellent sewing machine! Very fast and reliable.', NOW()),
(2, 41, 13, 2, 4, 'Good quality but a bit pricey.', NOW()),
(3, 41, 25, 3, 5, 'Perfect for industrial use!', NOW()),

-- Product 42 Reviews
(4, 42, 2, 1, 5, 'Great piping machine, very precise.', NOW()),
(5, 42, 14, 2, 4, 'Works well but needs regular maintenance.', NOW()),
(6, 42, 26, 3, 5, 'Excellent for professional use!', NOW()),

-- Product 43 Reviews
(7, 43, 3, 1, 5, 'Button sewing machine works perfectly!', NOW()),
(8, 43, 15, 2, 4, 'Good machine but instructions could be better.', NOW()),
(9, 43, 27, 3, 5, 'Very efficient button sewing!', NOW()),

-- Product 44 Reviews
(10, 44, 4, 1, 5, 'Buttonholer machine is precise and fast.', NOW()),
(11, 44, 16, 2, 4, 'Good quality but needs practice to master.', NOW()),
(12, 44, 28, 3, 5, 'Perfect for professional tailoring!', NOW()),

-- Product 45 Reviews
(13, 45, 5, 1, 5, 'Excellent overlock machine!', NOW()),
(14, 45, 17, 2, 4, 'Good machine but noisy.', NOW()),
(15, 45, 29, 3, 5, 'Very reliable and fast!', NOW());
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `review_media`
--

LOCK TABLES `review_media` WRITE;
/*!40000 ALTER TABLE `review_media` DISABLE KEYS */;
INSERT INTO `review_media` VALUES 
(1, 1, 'https://example.com/review1.jpg', 'image/jpeg'),
(2, 4, 'https://example.com/review2.jpg', 'image/jpeg'),
(3, 7, 'https://example.com/review3.jpg', 'image/jpeg'),
(4, 10, 'https://example.com/review4.jpg', 'image/jpeg'),
(5, 13, 'https://example.com/review5.jpg', 'image/jpeg');
/*!40000 ALTER TABLE `review_media` ENABLE KEYS */;
UNLOCK TABLES;

-- Inventory and Supplier Management
--
-- Table structure for table `suppliers`
--
DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `supplier_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `supplier_name` VARCHAR(255) NOT NULL,
  `contact_person` VARCHAR(100),
  `phone_number` VARCHAR(30) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE ,
  `address` VARCHAR(255),
  `supplier_status` VARCHAR(50) DEFAULT 'active',
  `registration_date` DATETIME DEFAULT CURRENT_TIMESTAMP 
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--
LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES 
(1,'SHUNFA','SHUNFA','1234567890','shunfa@gmail.com','123 Main St, Anytown, USA','active','2025-05-16 08:23:38'),
(2,'Juki','Juki','1334567890','juki@gmail.com','123 Main St, Anytown, USA','active','2025-05-16 08:23:38'),
(3,'Skylab','Skylab','1434567890','skylab@gmail.com','123 Main St, Anytown, USA','active','2025-05-16 08:23:38'),
(4,'Quitalig','Quitalig','1534567890','quitalig@gmail.com','123 Main St, Anytown, USA','active','2025-05-16 08:23:38');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_suppliers`
--

DROP TABLE IF EXISTS `product_suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_suppliers` (
  `product_supplier_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `supplier_id` int NOT NULL,
  `supplier_price` DECIMAL(10,2) NOT NULL,
  `is_primary` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`product_supplier_id`),
  KEY `product_id` (`product_id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `product_suppliers_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `product_suppliers_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_suppliers`
--

LOCK TABLES `product_suppliers` WRITE;
/*!40000 ALTER TABLE `product_suppliers` DISABLE KEYS */;
INSERT INTO `product_suppliers` VALUES 
(1,1,1,100.00,0),
(2,1,2,100.00,0),
(3,1,3,100.00,0),
(4,1,4,100.00,0);
/*!40000 ALTER TABLE `product_suppliers` ENABLE KEYS */;
UNLOCK TABLES;

-- DAMAGE PRODUCTS 
--
-- Table structure for table `damage_products`
--

DROP TABLE IF EXISTS `damage_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `damage_products` (
  `damage_id` INT AUTO_INCREMENT PRIMARY KEY,
  `damage_reason` TEXT NOT NULL,
  `reported_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `quantity` INT NOT NULL DEFAULT 1,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `order_id` INT NOT NULL,
  `supplier_id` INT NOT NULL,
  `return_id` INT NOT NULL,
  `refund_id` INT NOT NULL,
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  KEY `order_id` (`order_id`),
  KEY `supplier_id` (`supplier_id`),
  KEY `return_id` (`return_id`),
  KEY `refund_id` (`refund_id`),
  CONSTRAINT `damage_products_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `damage_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `damage_products_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `damage_products_ibfk_4` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`),
  CONSTRAINT `damage_products_ibfk_5` FOREIGN KEY (`return_id`) REFERENCES `returns` (`return_id`),
  CONSTRAINT `damage_products_ibfk_6` FOREIGN KEY (`refund_id`) REFERENCES `refunds` (`refund_id`)

) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `damage_products`
--
LOCK TABLES `damage_products` WRITE;
/*!40000 ALTER TABLE `damage_products` DISABLE KEYS */;
INSERT INTO `damage_products` VALUES 
(1,'Damage','Damage','2025-05-16 08:23:38',1,1,1,1,1,1);
/*!40000 ALTER TABLE `damage_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_transactions`
--
DROP TABLE IF EXISTS `inventory_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `quantity_change` int NOT NULL,
  `transaction_type` varchar(50) NOT NULL,
  `reference_id` INT NOT NULL, -- can link to order_id, return_request_id, etc.
  `notes` TEXT,
  `transaction_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `staff_id` INT NOT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `product_id` (`product_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `inventory_transactions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `inventory_transactions_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transactions`
--

LOCK TABLES `inventory_transactions` WRITE;
/*!40000 ALTER TABLE `inventory_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--
DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `inventory_id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `order_id` INT NOT NULL,
  `stock_quantity` INT NOT NULL,
  `stock_in` INT NOT NULL,
  `stock_out` INT NOT NULL,
  `min_stock` INT NOT NULL,
  `max_stock` INT NOT NULL,
  `available_stock` INT NOT NULL,
  `stock_status` VARCHAR(50) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE  CURRENT_TIMESTAMP,
  PRIMARY KEY (inventory_id),
  KEY `product_id` (`product_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;
  
--
-- Table structure for table `supply_requests`
--
DROP TABLE IF EXISTS `supply_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supply_requests` (
  `request_id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `quantity_requested` INT NOT NULL,
  `supply_status` VARCHAR(20) DEFAULT 'pending', -- approve, reject
  `notes` TEXT,
  `request_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_supply_request_staff` (`staff_id`),
  KEY `idx_supply_request_status` (`supply_status`),
  CONSTRAINT `supply_requests_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `supply_requests_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supply_requests`
--
LOCK TABLES `supply_requests` WRITE;
/*!40000 ALTER TABLE `supply_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `supply_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--
DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `sales_id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `sale_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `payment_id` INT NOT NULL,

  PRIMARY KEY (`sales_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_sale_user` (`user_id`),
  KEY `idx_sale_payment` (`payment_id`),
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `sales_ibfk_3` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--
LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_verifications`
--
DROP TABLE IF EXISTS `email_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_verifications` (
  `email_id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL,
  `code` VARCHAR(6) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NOT NULL,
  `is_used` BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_verifications`
--
LOCK TABLES `email_verifications` WRITE;
/*!40000 ALTER TABLE `email_verifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phone_verifications`
--
DROP TABLE IF EXISTS `phone_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phone_verifications` (
  `phone_id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `code` VARCHAR(6) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NOT NULL,
  `is_used` BOOLEAN DEFAULT FALSE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phone_verifications`
--
LOCK TABLES `phone_verifications` WRITE;
/*!40000 ALTER TABLE `phone_verifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `phone_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alembic_version`
--

DROP TABLE IF EXISTS `alembic_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alembic_version` (
  `version_num` varchar(32) NOT NULL,
  PRIMARY KEY (`version_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alembic_version`
--

LOCK TABLES `alembic_version` WRITE;
/*!40000 ALTER TABLE `alembic_version` DISABLE KEYS */;
INSERT INTO `alembic_version` VALUES ('e8ab16225aab');
/*!40000 ALTER TABLE `alembic_version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Adding useful indexes to existing tables
--

--
-- Inserting sample data for new tables
--

--
-- Dumping events for database 'sadprojectdb'
--
--
-- Dumping routines for database 'sadprojectdb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-18 13:58:42

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `payment_method_id` int NOT NULL AUTO_INCREMENT,
  `method_name` varchar(100) NOT NULL,
  PRIMARY KEY (`payment_method_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES 
(1, 'COD'),
(2, 'Bank Transfer'),
(3, 'GCash');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;
