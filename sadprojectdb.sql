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
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `unique_product_name_model` (`product_name`,`model_number`),
  KEY `category_id` (`category_id`),
  FULLTEXT KEY `product_search` (`product_name`, `description`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES 
(41,'SHUNFA SF-5550 Single Needle High-Speed Machine','SF-5550','Shunfa\'s SF-5550 is a high-speed, single needle lockstitch industrial sewing machine. It\'s ideal for garment factories, providing consistent and accurate stitching for various fabric types.',4,8450.75,'2025-05-16 08:23:38','2025-05-16 08:23:38'),
(42,'SHUNFA SF-562-02BB – Piping Machine','SF-562-02BB','Shunfa SF-562-02BB is a specialized overlock machine equipped with a piping foot, suitable for sewing decorative or functional piping into garment seams.',4,8999.99,'2025-05-16 08:31:51','2025-05-16 08:58:27'),
(43,'SHUNFA SF-372 – Button Sew Machine','SF-372','Shunfa SF-372 is designed for button attachment on shirts, jackets, and other garments, providing secure stitching with adjustable settings.',4,5799.00,'2025-05-16 09:25:46','2025-05-16 09:27:39'),
(44,'SHUNFA SF-781 – Buttonholer Machine','SF-781','Shunfa SF-781 is an industrial buttonholer ideal for producing precise, consistent buttonholes across light to medium fabrics.',4,8999.00,'2025-05-16 09:32:40','2025-05-16 09:32:40'),
(45,'SHUNFA SF-737 – 3-Thread Overlock Machine','SF-737','Shunfa SF-737 is a 3-thread overlock machine used for edge finishing and light seaming in knitted and woven fabrics.',4,10599.00,'2025-05-16 09:38:58','2025-05-17 07:34:41'),
(47,'SHUNFA SF-757 – 5-Thread Overlock Machine','SF-757','Shunfa SF-757 combines overlock and safety stitching in one operation, ideal for trousers, jeans, and heavy-duty garments.',4,10999.00,'2025-05-16 09:39:25','2025-05-16 09:39:25'),
(48,'SHUNFA JA2-2 – Household Sewing Machine','JA2-2','Shunfa JA2-2 is a durable household sewing machine designed for home use or small-scale tailoring, offering manual control and stable performance.',4,10999.00,'2025-05-16 09:39:49','2025-05-16 09:39:49'),
(49,'SHUNFA SF-747 – 4-Thread Overlock Machine','SF-747','Shunfa SF-747 is a 4-thread overlock machine that balances seam strength and flexibility, suitable for most garment construction.',4,9999.00,'2025-05-16 09:47:38','2025-05-16 09:47:38'),
(50,'Juki DDL-8100E – Single Needle High-Speed Lockstitch Machine','DDL-8100E','The Juki DDL-8100E is a high-speed, single-needle lockstitch sewing machine designed for industrial applications. It offers precise stitching and is suitable for light to medium-weight fabrics.',5,10898.00,'2025-05-16 10:02:14','2025-05-16 10:06:29'),
(51,'Juki MO-6700DA Series – Semi-Dry Head Overlock Machine','MO-6700DA Series','The Juki MO-6700DA Series is a high-speed overlock machine featuring semi-dry head technology, which reduces oil stains on sewing products. It is suitable for various fabrics and offers enhanced durability.',5,8998.00,'2025-05-16 10:02:14','2025-05-16 10:06:29'),
(52,'Juki W562-02BB – Piping Machine','W562-02BB','The Juki W562-02BB is a specialized piping machine designed for sewing piping into seams, commonly used in garment manufacturing for decorative or functional purposes.',5,7899.00,'2025-05-16 10:02:14','2025-05-16 10:06:29'),
(53,'Juki LU-1508N – Walking Foot Lockstitch Machine','LU-1508N','The Juki LU-1508N is a walking foot lockstitch sewing machine designed for heavy-duty applications, providing consistent stitching on thick and multi-layered materials.',5,12998.00,'2025-05-16 10:02:15','2025-05-16 10:06:29'),
(54,'Juki LK-1900S – Computer-Controlled Bartacking Machine','LK-1900S','The Juki LK-1900S is a computer-controlled bartacking machine designed for high-speed and high-quality bartack stitching, suitable for various garment applications.',5,11998.00,'2025-05-16 10:02:15','2025-05-16 10:06:29'),
(55,'Skylab – Lacoste Fabric','Lacoste','Locally manufactured Lacoste fabric from Skylab, ideal for polo shirts and casual wear. Features a textured knit with excellent breathability and stretch.\n\nFor bulk orders, kindly send us a private message for further assistance.',11,499.00,'2025-05-16 10:25:08','2025-05-16 10:34:22'),
(56,'Skylab – TR Lacoste Fabric','TR Lacoste','TR Lacoste fabric blends polyester and rayon, offering a durable and wrinkle-resistant material with a soft feel, commonly used for uniforms and corporate wear. For bulk orders, kindly send us a private message for further assistance.',11,599.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(57,'Quitalig – China Cotton 135 GSM','Cotton','Lightweight 100% cotton fabric suitable for warm climates, shirts, linings, or layering. For bulk orders, kindly send us a private message for further assistance.',9,499.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(58,'Quitalig – China Cotton 165 GSM','Cotton','Midweight cotton fabric ideal for general garments like t-shirts, dresses, and uniforms. For bulk orders, kindly send us a private message for further assistance.',9,499.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(59,'Quitalig – China Cotton 185 GSM','Cotton','Heavier cotton fabric for durable garments like workwear or outerwear with a soft, breathable feel. For bulk orders, kindly send us a private message for further assistance.',9,499.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(60,'Quitalig – China Cotton 200 GSM','Cotton','High-density cotton for structured clothing and durable garments. Excellent for embroidery. For bulk orders, kindly send us a private message for further assistance.',9,499.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(61,'Skylab – TC Fabric','TC (Tetron Cotton)','TC (Tetron Cotton) fabric combines polyester with cotton for strength, easy care, and wrinkle resistance. Common in uniforms and casual apparel. For bulk orders, kindly send us a private message for further assistance.',10,599.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(62,'Skylab – CVC Cotton Fabric','CVC','CVC (Chief Value Cotton) fabric has higher cotton content for comfort with added durability and lower shrinkage, perfect for everyday garments. For bulk orders, kindly send us a private message for further assistance.',10,599.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(63,'Skylab – Ribbings for Neckline','Ribbing','Stretchable ribbing fabric used in collars, cuffs, and hems to enhance flexibility and fit. For bulk orders, kindly send us a private message for further assistance.',11,599.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(64,'Charmeuse Silk','Charmeuse Silk','Charmeuse is a luxurious silk fabric known for its high-gloss finish and smooth texture. It is lightweight and drapes beautifully, making it ideal for elegant evening wear, lingerie, and scarves. For bulk orders, kindly send us a private message for further assistance.',12,1499.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(65,'Chiffon Silk','Chiffon Silk','Chiffon silk is a lightweight, sheer fabric with a soft, flowing drape. It is often used in layering garments such as dresses, blouses, and scarves, providing an airy and romantic aesthetic. For bulk orders, kindly send us a private message for further assistance.',12,1499.00,'2025-05-16 10:38:00','2025-05-16 10:38:00'),
(66,'Crepe de Chine Silk','Crepe de Chine Silk','Crepe de Chine is a lightweight silk fabric with a soft, crinkled texture. It offers a subtle sheen and is commonly used for blouses, dresses, and scarves, providing an elegant and refined appearance. For bulk orders, kindly send us a private message for further assistance.',12,1499.00,'2025-05-16 10:38:00','2025-05-16 10:38:00'),
(83,'Bobbin Case','B9117-012-000','The bobbin case holds the bobbin in place and ensures smooth thread flow to form stitches. For bulk orders, kindly send us a private message for further assistance.',6,120.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(84,'Bobbin','B1837-012-000','The bobbin stores the bottom thread, which works in tandem with the needle thread to form stitches. For bulk orders, kindly send us a private message for further assistance.',6,15.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(85,'Positioning Finger','B1835-012-000','The positioning finger guides the fabric through the machine to ensure alignment and prevent slippage during high-speed sewing. For bulk orders, kindly send us a private message for further assistance.',2,60.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(86,'Rotating Hook','B1830-127-000','The rotating hook picks up the top thread and loops it around the bobbin thread to create stitches. For bulk orders, kindly send us a private message for further assistance.',6,350.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(87,'Presser Foot','B3421-552-000','The presser foot holds fabric in place while stitching and applies pressure to ensure even feeding of fabric. For bulk orders, kindly send us a private message for further assistance.',6,40.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(88,'Clutch Motor for Sewing Machine','UNO Clutch Motor','The clutch motor provides the power to drive the sewing machine, essential for high-speed industrial sewing. For bulk orders, kindly send us a private message for further assistance.',7,2200.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(89,'Servo Motor for Sewing Machine','UNO Servo Motor','Servo motors offer precise speed control and are energy-efficient, providing smooth operation and reducing energy consumption. For bulk orders, kindly send us a private message for further assistance.',7,2500.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(90,'Table and Stand for Industrial Sewing Machine','VARIES','A sturdy table and stand that supports industrial sewing machines, designed for stability during high-speed sewing. For bulk orders, kindly send us a private message for further assistance.',7,3500.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(91,'Universal Needles','DBx1','Universal needles are suitable for most types of fabrics, offering reliable stitching for general purposes. For bulk orders, kindly send us a private message for further assistance.',8,10.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(92,'Ballpoint Needles','DBxK','Ballpoint needles are designed for sewing knit fabrics, preventing snags and providing smooth stitching on stretchy materials. For bulk orders, kindly send us a private message for further assistance.',8,12.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(93,'Jeans Needles','DBx1-JEANS','Jeans needles have a strong shaft and a thick, strong needle point designed specifically for sewing through heavy fabrics like denim and canvas without breaking. For bulk orders, kindly send us a private message for further assistance.',8,15.00,'2025-05-16 10:37:59','2025-05-16 10:37:59'),
(94,'Microtex Needles','DBx1-Microtex','Microtex needles have a very slim, sharp point designed to handle fine fabrics such as silk, tulle, or microfiber without damaging them. For bulk orders, kindly send us a private message for further assistance.',8,18.00,'2025-05-16 10:37:59','2025-05-16 10:37:59');

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
(141, 65, '/static/pictures/chiffon-fabric.jpeg', 'main', 0, null),
(142, 42, '/static/pictures/SHUNFA SF-562-02BB – Piping Machine.jpg', 'main', 0, null),
(143, 88, '/static/pictures/Clutch Motor for Sewing Machine.jpg', 'main', 0, null),
(144, 89, '/static/pictures/Servo Motor for Sewing Machine.jpg', 'main', 0, null),
(145, 90, '/static/pictures/Table and Stand for Industrial Sewing Machine.jpg', 'main', 0, null),
(146, 91, '/static/pictures/Universal Needles.jpg', 'main', 0, null),
(147, 92, '/static/pictures/Ballpoint Needles.jpg', 'main', 0, null),
(148, 93, '/static/pictures/Jeans Needles.jpg', 'main', 0, null),
(149, 94, '/static/pictures/Microtex Needles.jpg', 'main', 0, null),
(150, 61, '/static/pictures/Skylab – TC Fabric.jpg', 'main', 0, null),
(151, 56, '/static/pictures/Skylab – TR Lacoste Fabric.jpg', 'main', 0, null),
(152, 63, '/static/pictures/Skylab – Ribbings for Neckline.jpg', 'main', 0, null),
(153, 64, '/static/pictures/Charmeuse Silk.jpg', 'main', 0, null),
(154, 66, '/static/pictures/Crepe de Chine Silk.jpg', 'main', 0, null);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--
/* DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE `product_variants` (
  `variant_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `color` varchar(100),
  `width` varchar(100),
  `silk_type` varchar(100),
  `material` varchar(100),
  `needle_size` varchar(100),
  `power` varchar(100),
  `speed_control` varchar(100),
  `size` varchar(100),
  `additional_price` decimal(10,2) DEFAULT '0.00',
  `stock_quantity` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`variant_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
*/
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
--
-- Dumping data for table `products`
--
/* INSERT INTO `product_variants` VALUES 
(1, 57,  'Blue', '1.2m',NULL, NULL, NULL, NULL, NULL, 0.00, 50,  NOW(), NOW()),
(2, 57, 'Red', '1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 45, NOW(), NOW()),
(3, 57,  'Black', '1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 30, NOW(), NOW()),
(4, 57, 'Blue', '1.5m', NULL, NULL, NULL, NULL, NULL, 20.00, 55, NOW(), NOW()),
(5, 57, 'Red', '1.5m', NULL, NULL, NULL, NULL, NULL, 20.00, 40, NOW(), NOW()),
(6, 57, 'Black', '1.5m', NULL, NULL, NULL, NULL, NULL, 20.00, 60,NOW(), NOW()),
(7, 58, 'Gray', '1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 50,  NOW(), NOW()),
(8, 58,  'Black', '1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 45, NOW(), NOW()),
(9, 58, 'White', '1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 55, NOW(), NOW()),
(10, 58, 'Gray', '1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 40,NOW(), NOW()),
(11, 58,  'Black', '1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 35,  NOW(), NOW()),
(12, 58, 'White', '1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 35,NOW(), NOW()),
(13, 59,  'Red', '1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 20, NOW(), NOW()),
(14, 59,  'Blue', '1.2m',  NULL, NULL, NULL, NULL, NULL, 0.00, 45, NOW(), NOW()),
(15, 59,  'White', '1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 55,NOW(), NOW()),
(16, 59,  'Red', '1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 50, NOW(), NOW()),
(17, 59,  'Blue', '1.5m',  NULL, NULL, NULL, NULL, NULL, 0.00, 30,NOW(), NOW()),
(18, 59,  'White', '1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 45, NOW(), NOW()),
(19, 60, 'Black','1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 50, NOW(), NOW()),
(20, 60, 'Navy', '1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 30, NOW(), NOW()),
(21, 60, 'White','1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 20,  NOW(), NOW()),
(22, 60, 'Black','1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 25,  NOW(), NOW()),
(23, 60, 'Navy', '1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 35, NOW(), NOW()),
(24, 60, 'White','1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 40, NOW(), NOW()),
(25, 61,  'Red', '1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 45,  NOW(), NOW()),
(26, 61, 'Blue', '1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(27, 61,  'Gray','1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 55, NOW(), NOW()),
(28, 61,  'Red', '1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 40,  NOW(), NOW()),
(29, 61, 'Blue', '1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 30,  NOW(), NOW()),
(30, 61,  'Gray','1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(31, 62, 'Red', '1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 25,  NOW(), NOW()),
(32, 62, 'Red', '1.2m',  NULL, NULL, NULL, NULL, NULL, 0.00, 35,  NOW(), NOW()),
(33, 62, 'Blue', '1.2m',  NULL, NULL, NULL, NULL, NULL, 0.00, 45, NOW(), NOW()),
(34, 62, 'Gray', '1.2m',  NULL, NULL, NULL, NULL, NULL, 0.00, 55,  NOW(), NOW()),
(35, 62, 'Red', '1.5m',  NULL, NULL, NULL, NULL, NULL, 0.00, 35, NOW(), NOW()),
(36, 62, 'Blue', '1.5m',  NULL, NULL, NULL, NULL, NULL, 0.00, 45, NOW(), NOW()),
(37, 62, 'Gray', '1.5m',  NULL, NULL, NULL, NULL, NULL, 0.00, 55, NOW(), NOW()),
(38, 55, 'White', '1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(39, 55, 'Black','1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(40, 55, 'Navy', '1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 25,  NOW(), NOW()),
(41, 55, 'White', '1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(42, 55, 'Black','1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(43, 55, 'Navy', '1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(44, 56, 'Red', '1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(45, 56, 'Navy', '1.2m', NULL, NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(46, 56, 'Red', '1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(47, 56, 'Navy', '1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(48, 63, 'White', '1.0m', NULL, NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(49, 63, 'Black', '1.0m', NULL, NULL, NULL, NULL, NULL, 0.00, 25,NOW(), NOW()),
(50, 63, 'Navy', '1.0m', NULL, NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(51, 63, 'White', '1.5m', NULL, NULL, NULL, NULL, NULL,0.00, 25, NOW(), NOW()),
(52, 63, 'Black', '1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(53, 63, 'Navy', '1.5m', NULL, NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(54, 64, 'Ivory', '0.9m','Pure Charmeuse Silk', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(55, 64, 'Black', '0.9m','Pure Charmeuse Silk', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(56, 64, 'Champagne', '0.9m','Pure Charmeuse Silk',NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(57, 64, 'Ivory', '1.5m','Pure Charmeuse Silk',NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(58, 64, 'Black', '1.5m','Pure Charmeuse Silk', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(59, 64, 'Champagne', '1.5m','Pure Charmeuse Silk', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(60, 64, 'Ivory', '0.9m','Charmeuse Silk Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(61, 64, 'Black', '0.9m','Charmeuse Silk Blend',NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(62, 64, 'Champagne', '0.9m', 'Charmeuse Silk Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(63, 64, 'Ivory', '1.5m','Charmeuse Silk Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(64, 64, 'Black', '1.5m','Charmeuse Silk Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(65, 64, 'Champagne', '1.5m','Charmeuse Silk Blend',NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(66, 65, 'Ivory', '0.9m','Pure Charmeuse Silk', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(67, 65, 'Black', '0.9m','Pure Charmeuse Silk', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(68, 65, 'Champagne', '0.9m','Pure Chiffon Silk', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(69, 65, 'Ivory', '1.5m','Pure Chiffon Silk', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(70, 65, 'Black', '1.5m','Pure Chiffon Silk', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(71, 65, 'Champagne', '1.5m','Pure Chiffon Silk', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(72, 65, 'Ivory', '0.9m','Chiffon Silk Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(73, 65, 'Black', '0.9m','Chiffon Silk Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(74, 65, 'Champagne', '0.9m', 'Chiffon Silk Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(75, 65, 'Ivory', '1.5m','Chiffon Silk Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(76, 65, 'Black', '1.5m','Chiffon Silk Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(77, 65, 'Champagne', '1.5m','Chiffon Silk Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(78, 66, 'Champagne', '0.9m','Pure Crepe de Chine Silk',NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(79, 66, 'Navy', '1.5m','Pure Crepe de Chine Silk', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(80, 66, 'Black', '1.5m','Pure Crepe de Chine Silk', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(81, 66, 'Champagne', '1.5m','Pure Crepe de Chine Silk', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(82, 66, 'Navy', '0.9m','Crepe de Chine Silk Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(83, 66, 'Black', '0.9m','Crepe de Chine Silk Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(84, 66, 'Champagne', '0.9m', 'Crepe de Chine Silk Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(85, 66, 'Navy', '1.5m','Crepe de Chine Silk Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(86, 66, 'Black', '1.5m','Crepe de Chine Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(87, 66, 'Champagne', '1.5m','Crepe de Chine Blend', NULL, NULL, NULL, NULL, 0.00, 25, NOW(), NOW()),
(88, 83, NULL, NULL, NULL, 'Stainless Steel', NULL, NULL, NULL, 0.00, 100, NOW(), NOW()),
(89, 83, NULL, NULL, NULL, NULL, NULL, NULL,  'Standard', 0.00, 100, NOW(), NOW()),
(90, 83, NULL, NULL, NULL, NULL, NULL, NULL,'Large', 0.00, 100, NOW(), NOW()),
(91, 84, NULL, NULL, NULL, 'Metal', NULL, NULL, NULL, 0.00, 100, NOW(), NOW()),
(92, 84, NULL, NULL, NULL, NULL, NULL, NULL,  'Small', 0.00, 100, NOW(), NOW()),
(93, 84, NULL, NULL, NULL, NULL, NULL, NULL,  'Medium', 0.00, 100, NOW(), NOW()),
(94, 84, NULL, NULL, NULL, NULL, NULL, NULL,  'Large', 0.00, 100, NOW(), NOW()),
(95, 85, NULL, NULL, NULL, 'Steel', NULL, NULL, NULL,  0.00, 100, NOW(), NOW()),
(96, 85, NULL, NULL, NULL, 'Alloy', NULL, NULL, NULL,0.00, 100, NOW(), NOW()),
(97, 85, NULL, NULL, NULL, NULL, NULL, NULL,  'Standard', 0.00, 100, NOW(), NOW()),
(98, 86, NULL, NULL, NULL, 'Steel', NULL, NULL, NULL,0.00, 100, NOW(), NOW()),
(99, 86, NULL, NULL, NULL, 'Alloy', NULL, NULL, NULL, 0.00, 100, NOW(), NOW()),
(100, 87, NULL, NULL, NULL, 'Steel', NULL, NULL, NULL,  0.00, 100, NOW(), NOW()),
(101, 87, NULL, NULL, NULL, 'Plastic', NULL, NULL, NULL,  0.00, 100, NOW(), NOW()),
(102, 88, NULL, NULL, NULL, NULL, NULL, '750W', NULL, 0.00, 50, NOW(), NOW()),
(103, 88, NULL, NULL, NULL, NULL, NULL, '1000W',  NULL, 0.00, 50, NOW(), NOW()),
(104, 89, NULL, NULL, NULL, NULL, NULL, '550W', NULL, 0.00, 50, NOW(), NOW()),
(105, 90, NULL, NULL, NULL, NULL, NULL, NULL,  'Standard', 0.00, 30, NOW(), NOW()),
(106, 91, NULL, NULL, NULL, NULL, '#9', NULL, NULL, 0.00, 200, NOW(), NOW()),
(107, 91, NULL, NULL, NULL, NULL,'#10', NULL, NULL,0.00, 200, NOW(), NOW()),
(108, 91, NULL, NULL, NULL, NULL, '#12',  NULL, NULL,0.00, 200, NOW(), NOW()),
(109, 91, NULL, NULL, NULL, NULL, '#14',  NULL, NULL,0.00, 200, NOW(), NOW()),
(110, 91, NULL, NULL, NULL, NULL,'#16', NULL, NULL,0.00, 200, NOW(), NOW()),
(111, 91, NULL, NULL, NULL, NULL, '#18',NULL, NULL,0.00, 200, NOW(), NOW()),
(112, 91, NULL, NULL, NULL, 'Steel', NULL, NULL, NULL, 0.00, 200, NOW(), NOW()),
(113, 91, NULL, NULL, NULL, 'Titanium Coated',NULL, NULL, NULL, 0.50, 200, NOW(), NOW()),
(114, 92, NULL, NULL, NULL, NULL, '#11', NULL, NULL, 0.00, 200, NOW(), NOW()),
(115, 92, NULL, NULL, NULL, NULL,'#14',  NULL, NULL,0.00, 200, NOW(), NOW()),
(116, 92, NULL, NULL, NULL, NULL, '#16',  NULL, NULL,0.00, 200, NOW(), NOW()),
(117, 92, NULL, NULL, NULL, 'Steel', NULL, NULL,NULL,0.00, 200, NOW(), NOW()),
(118, 92, NULL, NULL, NULL, 'Titanium Coated', NULL, NULL, NULL,0.50, 200, NOW(), NOW()),
(119, 93, NULL, NULL, NULL, NULL, '#16', NULL, NULL, 0.00, 200, NOW(), NOW()),
(120, 93, NULL, NULL, NULL, NULL, '#18', NULL, NULL, 0.00, 200, NOW(), NOW()),
(121, 93, NULL, NULL, NULL, 'Steel',NULL, NULL, NULL, 0.00, 200, NOW(), NOW()),
(122, 93, NULL, NULL, NULL, 'Titanium Coated', NULL, NULL, NULL, 0.50, 200, NOW(), NOW()),
(123, 94, NULL, NULL, NULL, NULL, '#9', NULL, NULL,0.00, 200, NOW(), NOW()),
(124, 94, NULL, NULL, NULL, NULL, '#10', NULL, NULL,0.00, 200, NOW(), NOW()),
(125, 94, NULL, NULL, NULL, NULL, '#11',  NULL, NULL,0.00, 200, NOW(), NOW()),
(126, 94, NULL, NULL, NULL, 'Steel', NULL, NULL, NULL, 0.00, 200, NOW(), NOW()),
(127, 94, NULL, NULL, NULL, 'Titanium Coated',NULL, NULL, NULL, 0.00, 200, NOW(), NOW()); */
LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES 
(1, 57, 'Color', 'Blue', 0.00, 50, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(2, 57, 'Color', 'Red', 0.00, 50, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(3, 57, 'Color', 'Black', 0.00, 50, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(4, 57, 'Size', '1.2m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(5, 57, 'Size', '1.5m', 20.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(6, 83, 'Material', 'Stainless Steel', 0.00, 100, NOW(), NOW()),
(7, 83, 'Size', 'Standard', 0.00, 100, NOW(), NOW()),
(8, 83, 'Size', 'Large', 0.00, 100, NOW(), NOW()),
(9, 84, 'Material', 'Metal', 0.00, 100, NOW(), NOW()),
(10, 84, 'Size', 'Small', 0.00, 100, NOW(), NOW()),
(11, 84, 'Size', 'Medium', 0.00, 100, NOW(), NOW()),
(12, 84, 'Size', 'Large', 0.00, 100, NOW(), NOW()),
(13, 85, 'Material', 'Steel', 0.00, 100, NOW(), NOW()),
(14, 85, 'Material', 'Alloy', 0.00, 100, NOW(), NOW()),
(15, 85, 'Size', 'Standard', 0.00, 100, NOW(), NOW()),
(16, 86, 'Material', 'Steel', 0.00, 100, NOW(), NOW()),
(17, 86, 'Material', 'Alloy', 0.00, 100, NOW(), NOW()),
(18, 87, 'Material', 'Steel', 0.00, 100, NOW(), NOW()),
(19, 87, 'Material', 'Plastic', 0.00, 100, NOW(), NOW()),
(20, 88, 'Power', '750W', 0.00, 50, NOW(), NOW()),
(21, 88, 'Power', '1000W', 0.00, 50, NOW(), NOW()),
(22, 89, 'Power', '550W', 0.00, 50, NOW(), NOW()),
(23, 90, 'Size', 'Standard', 0.00, 30, NOW(), NOW()),
(24, 91, 'Needle Size', '#9', 0.00, 200, NOW(), NOW()),
(25, 91, 'Needle Size', '#10', 0.00, 200, NOW(), NOW()),
(26, 91, 'Needle Size', '#12', 0.00, 200, NOW(), NOW()),
(27, 91, 'Needle Size', '#14', 0.00, 200, NOW(), NOW()),
(28, 91, 'Needle Size', '#16', 0.00, 200, NOW(), NOW()),
(29, 91, 'Needle Size', '#18', 0.00, 200, NOW(), NOW()),
(30, 91, 'Material', 'Steel', 0.00, 200, NOW(), NOW()),
(31, 91, 'Material', 'Titanium Coated', 0.50, 200, NOW(), NOW()),
(32, 92, 'Needle Size', '#11', 0.00, 200, NOW(), NOW()),
(33, 92, 'Needle Size', '#14', 0.00, 200, NOW(), NOW()),
(34, 92, 'Needle Size', '#16', 0.00, 200, NOW(), NOW()),
(35, 92, 'Material', 'Steel', 0.00, 200, NOW(), NOW()),
(36, 92, 'Material', 'Titanium Coated', 0.50, 200, NOW(), NOW()),
(37, 93, 'Needle Size', '#16', 0.00, 200, NOW(), NOW()),
(38, 93, 'Needle Size', '#18', 0.00, 200, NOW(), NOW()),
(39, 93, 'Material', 'Steel', 0.00, 200, NOW(), NOW()),
(40, 93, 'Material', 'Titanium Coated', 0.50, 200, NOW(), NOW()),
(41, 94, 'Needle Size', '#9', 0.00, 200, NOW(), NOW()),
(42, 94, 'Needle Size', '#10', 0.00, 200, NOW(), NOW()),
(43, 94, 'Needle Size', '#11', 0.00, 200, NOW(), NOW()),
(44, 94, 'Material', 'Steel', 0.00, 200, NOW(), NOW()),
(45, 94, 'Material', 'Titanium Coated', 0.50, 200, NOW(), NOW()),
(46, 58, 'Color', 'Gray', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(47, 58, 'Color', 'Black', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(48, 58, 'Color', 'White', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(49, 58, 'Size', '1.2m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(50, 58, 'Size', '1.5m', 20.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(51, 59, 'Color', 'Red', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(52, 59, 'Color', 'Blue', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(53, 59, 'Color', 'White', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(54, 59, 'Size', '1.2m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(55, 59, 'Size', '1.5m', 20.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(56, 60, 'Color', 'Black', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(57, 60, 'Color', 'Navy', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(58, 60, 'Color', 'White', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(59, 60, 'Size', '1.2m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(60, 60, 'Size', '1.5m', 20.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(61, 61, 'Color', 'Red', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(62, 61, 'Color', 'Blue', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(63, 61, 'Color', 'Gray', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(64, 61, 'Size', '1.2m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(65, 61, 'Size', '1.5m', 20.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(66, 62, 'Color', 'Red', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(67, 62, 'Color', 'Blue', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(68, 62, 'Color', 'Gray', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(69, 62, 'Size', '1.2m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(70, 62, 'Size', '1.5m', 20.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(71, 55, 'Color', 'White', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(72, 55, 'Color', 'Black', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(73, 55, 'Color', 'Navy', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(74, 55, 'Size', '1.2m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(75, 55, 'Size', '1.5m', 25.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(76, 56, 'Color', 'Red', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(77, 56, 'Color', 'Navy', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(78, 56, 'Size', '1.2m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(79, 56, 'Size', '1.5m', 25.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(80, 63, 'Color', 'White', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(81, 63, 'Color', 'Black', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(82, 63, 'Color', 'Navy', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(83, 63, 'Size', '1.0m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(84, 63, 'Size', '1.5m', 25.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(85, 64, 'Silk Type', 'Pure Charmeuse Silk', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(86, 64, 'Silk Type', 'Charmeuse Silk Blend', 5.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(87, 64, 'Color', 'Ivory', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(88, 64, 'Color', 'Black', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(89, 64, 'Color', 'Champagne', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(90, 64, 'Size', '0.9m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(91, 64, 'Size', '1.5m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(92, 65, 'Silk Type', 'Pure Chiffon Silk', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(93, 65, 'Silk Type', 'Chiffon Silk Blend', 5.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(94, 65, 'Color', 'Ivory', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(95, 65, 'Color', 'Black', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(96, 65, 'Color', 'Champagne', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(97, 65, 'Size', '0.9m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(98, 65, 'Size', '1.5m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(99, 66, 'Silk Type', 'Pure Crepe de Chine Silk ', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(100, 66, 'Silk Type', 'Crepe de Chine Silk Blend', 5.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(101, 66, 'Color', 'Black', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(102, 66, 'Color', 'Champagne', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(103, 66, 'Color', 'Navy', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(104, 66, 'Size', '0.9m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(105, 66, 'Size', '1.5m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00');
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
  `address_id` int NOT NULL,
  `status_id` int NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `status_id` (`status_id`),
  KEY `cancellation_id` (`cancellation_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`address_id`),
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
(48, 4, NULL, '2025-05-31 21:00:00', 599.00, 4, 4, NOW(), NOW()),
(49, 1, NULL, '2024-03-04 00:00:00', 7811.13, 6, 1, '2024-03-04 00:00:00', '2024-03-04 00:00:00'),
(50, 1, NULL, '2024-03-27 00:00:00', 6349.96, 8, 3, '2024-03-27 00:00:00', '2024-03-27 00:00:00'),
(51, 1, NULL, '2024-03-10 00:00:00', 8978.89, 4, 2, '2024-03-10 00:00:00', '2024-03-10 00:00:00'),
(52, 1, NULL, '2024-03-16 00:00:00', 7174.44, 3, 2, '2024-03-16 00:00:00', '2024-03-16 00:00:00'),
(53, 1, NULL, '2024-04-21 00:00:00', 2753.34, 8, 2, '2024-04-21 00:00:00', '2024-04-21 00:00:00'),
(54, 1, NULL, '2024-05-15 00:00:00', 5945.18, 1, 3, '2024-05-15 00:00:00', '2024-05-15 00:00:00'),
(55, 1, NULL, '2024-05-09 00:00:00', 2783.66, 5, 3, '2024-05-09 00:00:00', '2024-05-09 00:00:00'),
(56, 1, NULL, '2024-05-26 00:00:00', 2039.64, 8, 1, '2024-05-26 00:00:00', '2024-05-26 00:00:00'),
(57, 1, NULL, '2024-05-30 00:00:00', 9245.66, 4, 2, '2024-05-30 00:00:00', '2024-05-30 00:00:00'),
(58, 1, NULL, '2024-04-19 00:00:00', 1535.81, 6, 1, '2024-04-19 00:00:00', '2024-04-19 00:00:00'),
(59, 2, NULL, '2024-03-05 00:00:00', 8415.57, 2, 1, '2024-03-05 00:00:00', '2024-03-05 00:00:00'),
(60, 2, NULL, '2024-04-10 00:00:00', 1398.47, 7, 2, '2024-04-10 00:00:00', '2024-04-10 00:00:00'),
(61, 2, NULL, '2024-03-22 00:00:00', 9237.43, 6, 3, '2024-03-22 00:00:00', '2024-03-22 00:00:00'),
(62, 2, NULL, '2024-04-04 00:00:00', 3195.21, 2, 3, '2024-04-04 00:00:00', '2024-04-04 00:00:00'),
(63, 2, NULL, '2024-03-01 00:00:00', 4101.54, 2, 1, '2024-03-01 00:00:00', '2024-03-01 00:00:00'),
(64, 2, NULL, '2024-03-07 00:00:00', 3407.41, 2, 2, '2024-03-07 00:00:00', '2024-03-07 00:00:00'),
(65, 2, NULL, '2024-04-24 00:00:00', 5091.84, 7, 2, '2024-04-24 00:00:00', '2024-04-24 00:00:00'),
(66, 2, NULL, '2024-05-23 00:00:00', 9909.44, 6, 1, '2024-05-23 00:00:00', '2024-05-23 00:00:00'),
(67, 2, NULL, '2024-04-15 00:00:00', 8693.18, 3, 3, '2024-04-15 00:00:00', '2024-04-15 00:00:00'),
(68, 2, NULL, '2024-05-08 00:00:00', 1470.28, 2, 3, '2024-05-08 00:00:00', '2024-05-08 00:00:00'),
(69, 3, NULL, '2024-05-07 00:00:00', 1563.3, 7, 2, '2024-05-07 00:00:00', '2024-05-07 00:00:00'),
(70, 3, NULL, '2024-04-10 00:00:00', 1590.61, 8, 1, '2024-04-10 00:00:00', '2024-04-10 00:00:00'),
(71, 3, NULL, '2024-05-23 00:00:00', 2975.28, 9, 3, '2024-05-23 00:00:00', '2024-05-23 00:00:00'),
(72, 3, NULL, '2024-05-21 00:00:00', 5061.62, 1, 1, '2024-05-21 00:00:00', '2024-05-21 00:00:00'),
(73, 3, NULL, '2024-03-09 00:00:00', 3554.57, 10, 3, '2024-03-09 00:00:00', '2024-03-09 00:00:00'),
(74, 3, NULL, '2024-05-30 00:00:00', 7103.96, 4, 3, '2024-05-30 00:00:00', '2024-05-30 00:00:00'),
(75, 3, NULL, '2024-05-21 00:00:00', 6472.42, 8, 2, '2024-05-21 00:00:00', '2024-05-21 00:00:00'),
(76, 3, NULL, '2024-05-26 00:00:00', 6585.56, 1, 2, '2024-05-26 00:00:00', '2024-05-26 00:00:00'),
(77, 3, NULL, '2024-04-07 00:00:00', 9930.61, 3, 3, '2024-04-07 00:00:00', '2024-04-07 00:00:00'),
(78, 3, NULL, '2024-04-13 00:00:00', 4958.56, 6, 1, '2024-04-13 00:00:00', '2024-04-13 00:00:00'),
(79, 4, NULL, '2024-04-13 00:00:00', 4751.33, 8, 3, '2024-04-13 00:00:00', '2024-04-13 00:00:00'),
(80, 4, NULL, '2024-03-05 00:00:00', 5102.92, 6, 2, '2024-03-05 00:00:00', '2024-03-05 00:00:00'),
(81, 4, NULL, '2024-05-15 00:00:00', 6659.77, 1, 3, '2024-05-15 00:00:00', '2024-05-15 00:00:00'),
(82, 4, NULL, '2024-04-11 00:00:00', 6206.62, 5, 1, '2024-04-11 00:00:00', '2024-04-11 00:00:00'),
(83, 4, NULL, '2024-05-09 00:00:00', 6000.93, 6, 1, '2024-05-09 00:00:00', '2024-05-09 00:00:00'),
(84, 4, NULL, '2024-03-11 00:00:00', 6130.44, 1, 3, '2024-03-11 00:00:00', '2024-03-11 00:00:00'),
(85, 4, NULL, '2024-03-19 00:00:00', 7649.6, 8, 2, '2024-03-19 00:00:00', '2024-03-19 00:00:00'),
(86, 4, NULL, '2024-04-22 00:00:00', 9958.03, 10, 1, '2024-04-22 00:00:00', '2024-04-22 00:00:00'),
(87, 4, NULL, '2024-03-20 00:00:00', 3678.83, 5, 2, '2024-03-20 00:00:00', '2024-03-20 00:00:00'),
(88, 4, NULL, '2024-03-31 00:00:00', 6416.71, 1, 2, '2024-03-31 00:00:00', '2024-03-31 00:00:00'),
(89, 5, NULL, '2024-04-19 00:00:00', 6064.95, 3, 3, '2024-04-19 00:00:00', '2024-04-19 00:00:00'),
(90, 5, NULL, '2024-03-22 00:00:00', 7532.6, 1, 3, '2024-03-22 00:00:00', '2024-03-22 00:00:00'),
(91, 5, NULL, '2024-04-27 00:00:00', 7510.23, 6, 2, '2024-04-27 00:00:00', '2024-04-27 00:00:00'),
(92, 5, NULL, '2024-05-31 00:00:00', 6710.26, 10, 3, '2024-05-31 00:00:00', '2024-05-31 00:00:00'),
(93, 5, NULL, '2024-04-08 00:00:00', 8496.05, 5, 3, '2024-04-08 00:00:00', '2024-04-08 00:00:00'),
(94, 5, NULL, '2024-05-15 00:00:00', 6942.84, 6, 3, '2024-05-15 00:00:00', '2024-05-15 00:00:00'),
(95, 5, NULL, '2024-04-23 00:00:00', 9802.93, 3, 3, '2024-04-23 00:00:00', '2024-04-23 00:00:00'),
(96, 5, NULL, '2024-04-04 00:00:00', 2827.84, 3, 3, '2024-04-04 00:00:00', '2024-04-04 00:00:00'),
(97, 5, NULL, '2024-03-17 00:00:00', 6531.25, 9, 1, '2024-03-17 00:00:00', '2024-03-17 00:00:00'),
(98, 5, NULL, '2024-04-27 00:00:00', 2995.21, 6, 3, '2024-04-27 00:00:00', '2024-04-27 00:00:00'),
(99, 6, NULL, '2024-03-06 00:00:00', 9608.3, 3, 1, '2024-03-06 00:00:00', '2024-03-06 00:00:00'),
(100, 6, NULL, '2024-03-09 00:00:00', 4505.33, 4, 2, '2024-03-09 00:00:00', '2024-03-09 00:00:00'),
(101, 6, NULL, '2024-03-06 00:00:00', 4722.63, 8, 2, '2024-03-06 00:00:00', '2024-03-06 00:00:00'),
(102, 6, NULL, '2024-04-27 00:00:00', 4938.74, 10, 3, '2024-04-27 00:00:00', '2024-04-27 00:00:00'),
(103, 6, NULL, '2024-03-06 00:00:00', 9194.41, 5, 3, '2024-03-06 00:00:00', '2024-03-06 00:00:00'),
(104, 6, NULL, '2024-05-11 00:00:00', 6494.95, 4, 3, '2024-05-11 00:00:00', '2024-05-11 00:00:00'),
(105, 6, NULL, '2024-03-05 00:00:00', 6440.78, 8, 3, '2024-03-05 00:00:00', '2024-03-05 00:00:00'),
(106, 6, NULL, '2024-05-06 00:00:00', 8604.51, 4, 2, '2024-05-06 00:00:00', '2024-05-06 00:00:00'),
(107, 6, NULL, '2024-04-22 00:00:00', 4287.54, 9, 1, '2024-04-22 00:00:00', '2024-04-22 00:00:00'),
(108, 6, NULL, '2024-03-25 00:00:00', 7913.26, 10, 2, '2024-03-25 00:00:00', '2024-03-25 00:00:00'),
(109, 7, NULL, '2024-05-19 00:00:00', 1242.27, 5, 2, '2024-05-19 00:00:00', '2024-05-19 00:00:00'),
(110, 7, NULL, '2024-05-08 00:00:00', 4490.24, 7, 1, '2024-05-08 00:00:00', '2024-05-08 00:00:00'),
(111, 7, NULL, '2024-03-23 00:00:00', 4256.33, 5, 2, '2024-03-23 00:00:00', '2024-03-23 00:00:00'),
(112, 7, NULL, '2024-05-27 00:00:00', 8915.11, 10, 2, '2024-05-27 00:00:00', '2024-05-27 00:00:00'),
(113, 7, NULL, '2024-03-18 00:00:00', 9491.71, 2, 3, '2024-03-18 00:00:00', '2024-03-18 00:00:00'),
(114, 7, NULL, '2024-05-12 00:00:00', 8958.83, 3, 2, '2024-05-12 00:00:00', '2024-05-12 00:00:00'),
(115, 7, NULL, '2024-05-04 00:00:00', 8784.45, 4, 3, '2024-05-04 00:00:00', '2024-05-04 00:00:00'),
(116, 7, NULL, '2024-04-07 00:00:00', 8898.83, 5, 1, '2024-04-07 00:00:00', '2024-04-07 00:00:00'),
(117, 7, NULL, '2024-03-16 00:00:00', 6532.19, 5, 2, '2024-03-16 00:00:00', '2024-03-16 00:00:00'),
(118, 7, NULL, '2024-03-18 00:00:00', 4951.68, 5, 2, '2024-03-18 00:00:00', '2024-03-18 00:00:00'),
(119, 8, NULL, '2024-05-27 00:00:00', 2169.68, 8, 1, '2024-05-27 00:00:00', '2024-05-27 00:00:00'),
(120, 8, NULL, '2024-04-02 00:00:00', 8751.85, 2, 2, '2024-04-02 00:00:00', '2024-04-02 00:00:00'),
(121, 8, NULL, '2024-05-08 00:00:00', 6234.91, 5, 3, '2024-05-08 00:00:00', '2024-05-08 00:00:00'),
(122, 8, NULL, '2024-04-24 00:00:00', 6177.34, 1, 3, '2024-04-24 00:00:00', '2024-04-24 00:00:00'),
(123, 8, NULL, '2024-03-14 00:00:00', 7100.65, 8, 2, '2024-03-14 00:00:00', '2024-03-14 00:00:00'),
(124, 8, NULL, '2024-03-07 00:00:00', 9384.45, 6, 1, '2024-03-07 00:00:00', '2024-03-07 00:00:00'),
(125, 8, NULL, '2024-03-24 00:00:00', 5472.94, 2, 1, '2024-03-24 00:00:00', '2024-03-24 00:00:00'),
(126, 8, NULL, '2024-05-23 00:00:00', 3802.07, 3, 2, '2024-05-23 00:00:00', '2024-05-23 00:00:00'),
(127, 8, NULL, '2024-04-13 00:00:00', 6916.9, 1, 3, '2024-04-13 00:00:00', '2024-04-13 00:00:00'),
(128, 8, NULL, '2024-04-05 00:00:00', 8112.37, 3, 2, '2024-04-05 00:00:00', '2024-04-05 00:00:00'),
(129, 9, NULL, '2024-05-18 00:00:00', 5335.67, 6, 1, '2024-05-18 00:00:00', '2024-05-18 00:00:00'),
(130, 9, NULL, '2024-03-01 00:00:00', 3214.0, 6, 3, '2024-03-01 00:00:00', '2024-03-01 00:00:00'),
(131, 9, NULL, '2024-04-15 00:00:00', 2936.73, 2, 3, '2024-04-15 00:00:00', '2024-04-15 00:00:00'),
(132, 9, NULL, '2024-05-16 00:00:00', 4315.47, 10, 2, '2024-05-16 00:00:00', '2024-05-16 00:00:00'),
(133, 9, NULL, '2024-03-14 00:00:00', 6071.64, 3, 1, '2024-03-14 00:00:00', '2024-03-14 00:00:00'),
(134, 9, NULL, '2024-05-03 00:00:00', 2800.47, 6, 2, '2024-05-03 00:00:00', '2024-05-03 00:00:00'),
(135, 9, NULL, '2024-05-08 00:00:00', 8303.4, 1, 3, '2024-05-08 00:00:00', '2024-05-08 00:00:00'),
(136, 9, NULL, '2024-05-31 00:00:00', 8692.95, 6, 2, '2024-05-31 00:00:00', '2024-05-31 00:00:00'),
(137, 9, NULL, '2024-04-22 00:00:00', 2414.29, 9, 1, '2024-04-22 00:00:00', '2024-04-22 00:00:00'),
(138, 9, NULL, '2024-05-20 00:00:00', 7060.57, 5, 2, '2024-05-20 00:00:00', '2024-05-20 00:00:00'),
(139, 10, NULL, '2024-05-31 00:00:00', 8310.71, 6, 3, '2024-05-31 00:00:00', '2024-05-31 00:00:00'),
(140, 10, NULL, '2024-04-01 00:00:00', 3461.11, 9, 2, '2024-04-01 00:00:00', '2024-04-01 00:00:00'),
(141, 10, NULL, '2024-03-16 00:00:00', 4768.66, 3, 1, '2024-03-16 00:00:00', '2024-03-16 00:00:00'),
(142, 10, NULL, '2024-03-19 00:00:00', 9390.36, 9, 1, '2024-03-19 00:00:00', '2024-03-19 00:00:00'),
(143, 10, NULL, '2024-05-04 00:00:00', 4430.5, 7, 2, '2024-05-04 00:00:00', '2024-05-04 00:00:00'),
(144, 10, NULL, '2024-04-25 00:00:00', 1036.56, 10, 2, '2024-04-25 00:00:00', '2024-04-25 00:00:00'),
(145, 10, NULL, '2024-05-08 00:00:00', 3769.3, 7, 3, '2024-05-08 00:00:00', '2024-05-08 00:00:00'),
(146, 10, NULL, '2024-03-06 00:00:00', 2318.58, 1, 2, '2024-03-06 00:00:00', '2024-03-06 00:00:00'),
(147, 10, NULL, '2024-05-03 00:00:00', 2956.07, 3, 3, '2024-05-03 00:00:00', '2024-05-03 00:00:00'),
(148, 10, NULL, '2024-04-23 00:00:00', 1199.8, 8, 2, '2024-04-23 00:00:00', '2024-04-23 00:00:00'),
(149, 11, NULL, '2024-04-16 00:00:00', 9828.85, 6, 3, '2024-04-16 00:00:00', '2024-04-16 00:00:00'),
(150, 11, NULL, '2024-03-15 00:00:00', 8636.61, 1, 1, '2024-03-15 00:00:00', '2024-03-15 00:00:00'),
(151, 11, NULL, '2024-03-28 00:00:00', 3227.4, 1, 3, '2024-03-28 00:00:00', '2024-03-28 00:00:00'),
(152, 11, NULL, '2024-05-03 00:00:00', 1251.79, 6, 3, '2024-05-03 00:00:00', '2024-05-03 00:00:00'),
(153, 11, NULL, '2024-04-29 00:00:00', 1975.12, 2, 3, '2024-04-29 00:00:00', '2024-04-29 00:00:00'),
(154, 11, NULL, '2024-04-06 00:00:00', 4169.07, 4, 3, '2024-04-06 00:00:00', '2024-04-06 00:00:00'),
(155, 11, NULL, '2024-05-12 00:00:00', 4161.35, 8, 1, '2024-05-12 00:00:00', '2024-05-12 00:00:00'),
(156, 11, NULL, '2024-04-23 00:00:00', 7874.93, 5, 2, '2024-04-23 00:00:00', '2024-04-23 00:00:00'),
(157, 11, NULL, '2024-04-28 00:00:00', 5469.39, 8, 3, '2024-04-28 00:00:00', '2024-04-28 00:00:00'),
(158, 11, NULL, '2024-05-15 00:00:00', 6830.77, 1, 3, '2024-05-15 00:00:00', '2024-05-15 00:00:00'),
(159, 12, NULL, '2024-04-27 00:00:00', 7164.74, 10, 3, '2024-04-27 00:00:00', '2024-04-27 00:00:00'),
(160, 12, NULL, '2024-04-25 00:00:00', 8090.42, 5, 1, '2024-04-25 00:00:00', '2024-04-25 00:00:00'),
(161, 12, NULL, '2024-03-20 00:00:00', 3510.95, 3, 3, '2024-03-20 00:00:00', '2024-03-20 00:00:00'),
(162, 12, NULL, '2024-05-18 00:00:00', 5445.41, 4, 1, '2024-05-18 00:00:00', '2024-05-18 00:00:00'),
(163, 12, NULL, '2024-03-27 00:00:00', 5266.12, 2, 3, '2024-03-27 00:00:00', '2024-03-27 00:00:00'),
(164, 12, NULL, '2024-03-02 00:00:00', 2935.04, 6, 2, '2024-03-02 00:00:00', '2024-03-02 00:00:00'),
(165, 12, NULL, '2024-03-04 00:00:00', 2688.34, 1, 3, '2024-03-04 00:00:00', '2024-03-04 00:00:00'),
(166, 12, NULL, '2024-04-24 00:00:00', 1744.49, 3, 3, '2024-04-24 00:00:00', '2024-04-24 00:00:00'),
(167, 12, NULL, '2024-05-28 00:00:00', 1440.47, 7, 3, '2024-05-28 00:00:00', '2024-05-28 00:00:00'),
(168, 12, NULL, '2024-04-23 00:00:00', 6860.51, 10, 1, '2024-04-23 00:00:00', '2024-04-23 00:00:00'),
(169, 13, NULL, '2024-03-11 00:00:00', 1520.54, 3, 3, '2024-03-11 00:00:00', '2024-03-11 00:00:00'),
(170, 13, NULL, '2024-05-04 00:00:00', 2644.16, 4, 1, '2024-05-04 00:00:00', '2024-05-04 00:00:00'),
(171, 13, NULL, '2024-05-23 00:00:00', 1500.84, 4, 1, '2024-05-23 00:00:00', '2024-05-23 00:00:00'),
(172, 13, NULL, '2024-05-08 00:00:00', 3567.27, 7, 1, '2024-05-08 00:00:00', '2024-05-08 00:00:00'),
(173, 13, NULL, '2024-03-23 00:00:00', 5601.33, 10, 3, '2024-03-23 00:00:00', '2024-03-23 00:00:00'),
(174, 13, NULL, '2024-04-23 00:00:00', 7402.11, 3, 2, '2024-04-23 00:00:00', '2024-04-23 00:00:00'),
(175, 13, NULL, '2024-03-03 00:00:00', 2165.89, 3, 1, '2024-03-03 00:00:00', '2024-03-03 00:00:00'),
(176, 13, NULL, '2024-05-09 00:00:00', 5013.24, 2, 2, '2024-05-09 00:00:00', '2024-05-09 00:00:00'),
(177, 13, NULL, '2024-03-30 00:00:00', 6783.67, 7, 3, '2024-03-30 00:00:00', '2024-03-30 00:00:00'),
(178, 13, NULL, '2024-03-20 00:00:00', 3759.79, 3, 3, '2024-03-20 00:00:00', '2024-03-20 00:00:00'),
(179, 14, NULL, '2024-04-27 00:00:00', 9658.76, 4, 2, '2024-04-27 00:00:00', '2024-04-27 00:00:00'),
(180, 14, NULL, '2024-05-27 00:00:00', 4981.42, 10, 1, '2024-05-27 00:00:00', '2024-05-27 00:00:00'),
(181, 14, NULL, '2024-04-08 00:00:00', 6100.85, 10, 2, '2024-04-08 00:00:00', '2024-04-08 00:00:00'),
(182, 14, NULL, '2024-05-21 00:00:00', 1161.78, 1, 2, '2024-05-21 00:00:00', '2024-05-21 00:00:00'),
(183, 14, NULL, '2024-05-28 00:00:00', 9757.94, 9, 1, '2024-05-28 00:00:00', '2024-05-28 00:00:00'),
(184, 14, NULL, '2024-04-11 00:00:00', 1325.55, 10, 3, '2024-04-11 00:00:00', '2024-04-11 00:00:00'),
(185, 14, NULL, '2024-03-07 00:00:00', 3597.59, 6, 3, '2024-03-07 00:00:00', '2024-03-07 00:00:00'),
(186, 14, NULL, '2024-03-16 00:00:00', 5285.18, 2, 1, '2024-03-16 00:00:00', '2024-03-16 00:00:00'),
(187, 14, NULL, '2024-03-16 00:00:00', 4412.19, 3, 2, '2024-03-16 00:00:00', '2024-03-16 00:00:00'),
(188, 14, NULL, '2024-05-29 00:00:00', 6041.69, 4, 2, '2024-05-29 00:00:00', '2024-05-29 00:00:00'),
(189, 15, NULL, '2024-05-13 00:00:00', 3557.52, 9, 1, '2024-05-13 00:00:00', '2024-05-13 00:00:00'),
(190, 15, NULL, '2024-03-15 00:00:00', 6476.31, 5, 2, '2024-03-15 00:00:00', '2024-03-15 00:00:00'),
(191, 15, NULL, '2024-03-11 00:00:00', 7832.54, 3, 2, '2024-03-11 00:00:00', '2024-03-11 00:00:00'),
(192, 15, NULL, '2024-04-15 00:00:00', 4568.36, 7, 1, '2024-04-15 00:00:00', '2024-04-15 00:00:00'),
(193, 15, NULL, '2024-04-15 00:00:00', 1739.58, 4, 2, '2024-04-15 00:00:00', '2024-04-15 00:00:00'),
(194, 15, NULL, '2024-03-14 00:00:00', 9058.48, 10, 2, '2024-03-14 00:00:00', '2024-03-14 00:00:00'),
(195, 15, NULL, '2024-04-29 00:00:00', 7555.51, 1, 2, '2024-04-29 00:00:00', '2024-04-29 00:00:00'),
(196, 15, NULL, '2024-05-20 00:00:00', 6912.37, 3, 1, '2024-05-20 00:00:00', '2024-05-20 00:00:00'),
(197, 15, NULL, '2024-03-14 00:00:00', 2051.39, 9, 1, '2024-03-14 00:00:00', '2024-03-14 00:00:00'),
(198, 15, NULL, '2024-05-06 00:00:00', 2941.1, 3, 2, '2024-05-06 00:00:00', '2024-05-06 00:00:00'),
(199, 16, NULL, '2024-05-18 00:00:00', 8907.58, 2, 1, '2024-05-18 00:00:00', '2024-05-18 00:00:00'),
(200, 16, NULL, '2024-05-31 00:00:00', 1505.61, 3, 3, '2024-05-31 00:00:00', '2024-05-31 00:00:00'),
(201, 16, NULL, '2024-04-13 00:00:00', 6227.86, 2, 2, '2024-04-13 00:00:00', '2024-04-13 00:00:00'),
(202, 16, NULL, '2024-03-12 00:00:00', 4639.78, 4, 3, '2024-03-12 00:00:00', '2024-03-12 00:00:00'),
(203, 16, NULL, '2024-03-14 00:00:00', 1392.71, 5, 1, '2024-03-14 00:00:00', '2024-03-14 00:00:00'),
(204, 16, NULL, '2024-05-24 00:00:00', 4074.61, 1, 1, '2024-05-24 00:00:00', '2024-05-24 00:00:00'),
(205, 16, NULL, '2024-05-25 00:00:00', 9399.87, 6, 2, '2024-05-25 00:00:00', '2024-05-25 00:00:00'),
(206, 16, NULL, '2024-04-14 00:00:00', 2248.39, 10, 2, '2024-04-14 00:00:00', '2024-04-14 00:00:00'),
(207, 16, NULL, '2024-05-31 00:00:00', 7809.06, 2, 2, '2024-05-31 00:00:00', '2024-05-31 00:00:00'),
(208, 16, NULL, '2024-04-26 00:00:00', 2998.23, 2, 2, '2024-04-26 00:00:00', '2024-04-26 00:00:00'),
(209, 17, NULL, '2024-03-25 00:00:00', 4159.25, 7, 3, '2024-03-25 00:00:00', '2024-03-25 00:00:00'),
(210, 17, NULL, '2024-04-08 00:00:00', 7392.03, 8, 3, '2024-04-08 00:00:00', '2024-04-08 00:00:00'),
(211, 17, NULL, '2024-04-10 00:00:00', 8518.81, 1, 2, '2024-04-10 00:00:00', '2024-04-10 00:00:00'),
(212, 17, NULL, '2024-05-05 00:00:00', 5257.28, 2, 1, '2024-05-05 00:00:00', '2024-05-05 00:00:00'),
(213, 17, NULL, '2024-04-21 00:00:00', 7579.77, 9, 2, '2024-04-21 00:00:00', '2024-04-21 00:00:00'),
(214, 17, NULL, '2024-05-07 00:00:00', 8580.32, 5, 2, '2024-05-07 00:00:00', '2024-05-07 00:00:00'),
(215, 17, NULL, '2024-05-04 00:00:00', 2677.01, 8, 1, '2024-05-04 00:00:00', '2024-05-04 00:00:00'),
(216, 17, NULL, '2024-03-03 00:00:00', 4296.52, 8, 1, '2024-03-03 00:00:00', '2024-03-03 00:00:00'),
(217, 17, NULL, '2024-03-09 00:00:00', 2849.26, 2, 2, '2024-03-09 00:00:00', '2024-03-09 00:00:00'),
(218, 17, NULL, '2024-05-22 00:00:00', 8391.93, 2, 3, '2024-05-22 00:00:00', '2024-05-22 00:00:00'),
(219, 18, NULL, '2024-03-19 00:00:00', 4791.18, 3, 1, '2024-03-19 00:00:00', '2024-03-19 00:00:00'),
(220, 18, NULL, '2024-04-24 00:00:00', 7782.05, 10, 3, '2024-04-24 00:00:00', '2024-04-24 00:00:00'),
(221, 18, NULL, '2024-05-09 00:00:00', 9760.38, 6, 3, '2024-05-09 00:00:00', '2024-05-09 00:00:00'),
(222, 18, NULL, '2024-05-02 00:00:00', 4643.63, 5, 3, '2024-05-02 00:00:00', '2024-05-02 00:00:00'),
(223, 18, NULL, '2024-05-03 00:00:00', 4086.58, 6, 3, '2024-05-03 00:00:00', '2024-05-03 00:00:00'),
(224, 18, NULL, '2024-03-01 00:00:00', 7012.94, 3, 3, '2024-03-01 00:00:00', '2024-03-01 00:00:00'),
(225, 18, NULL, '2024-05-29 00:00:00', 6035.32, 2, 2, '2024-05-29 00:00:00', '2024-05-29 00:00:00'),
(226, 18, NULL, '2024-04-20 00:00:00', 4105.93, 2, 2, '2024-04-20 00:00:00', '2024-04-20 00:00:00'),
(227, 18, NULL, '2024-04-23 00:00:00', 1298.88, 7, 2, '2024-04-23 00:00:00', '2024-04-23 00:00:00'),
(228, 18, NULL, '2024-05-08 00:00:00', 6320.53, 1, 1, '2024-05-08 00:00:00', '2024-05-08 00:00:00'),
(229, 19, NULL, '2024-04-20 00:00:00', 2557.8, 9, 2, '2024-04-20 00:00:00', '2024-04-20 00:00:00'),
(230, 19, NULL, '2024-04-10 00:00:00', 9325.8, 3, 3, '2024-04-10 00:00:00', '2024-04-10 00:00:00'),
(231, 19, NULL, '2024-04-07 00:00:00', 8920.14, 2, 1, '2024-04-07 00:00:00', '2024-04-07 00:00:00'),
(232, 19, NULL, '2024-04-19 00:00:00', 1089.68, 4, 2, '2024-04-19 00:00:00', '2024-04-19 00:00:00'),
(233, 19, NULL, '2024-04-14 00:00:00', 6514.05, 10, 1, '2024-04-14 00:00:00', '2024-04-14 00:00:00'),
(234, 19, NULL, '2024-03-21 00:00:00', 8333.37, 2, 2, '2024-03-21 00:00:00', '2024-03-21 00:00:00'),
(235, 19, NULL, '2024-05-17 00:00:00', 2874.17, 7, 2, '2024-05-17 00:00:00', '2024-05-17 00:00:00'),
(236, 19, NULL, '2024-03-08 00:00:00', 7742.77, 10, 2, '2024-03-08 00:00:00', '2024-03-08 00:00:00'),
(237, 19, NULL, '2024-04-15 00:00:00', 3146.89, 9, 1, '2024-04-15 00:00:00', '2024-04-15 00:00:00'),
(238, 19, NULL, '2024-04-30 00:00:00', 6627.29, 7, 3, '2024-04-30 00:00:00', '2024-04-30 00:00:00'),
(239, 20, NULL, '2024-05-27 00:00:00', 2197.24, 3, 1, '2024-05-27 00:00:00', '2024-05-27 00:00:00'),
(240, 20, NULL, '2024-04-04 00:00:00', 9512.26, 7, 2, '2024-04-04 00:00:00', '2024-04-04 00:00:00'),
(241, 20, NULL, '2024-03-30 00:00:00', 1186.22, 2, 1, '2024-03-30 00:00:00', '2024-03-30 00:00:00'),
(242, 20, NULL, '2024-04-08 00:00:00', 1466.55, 10, 2, '2024-04-08 00:00:00', '2024-04-08 00:00:00'),
(243, 20, NULL, '2024-05-28 00:00:00', 6211.28, 1, 2, '2024-05-28 00:00:00', '2024-05-28 00:00:00'),
(244, 20, NULL, '2024-05-26 00:00:00', 9968.45, 5, 3, '2024-05-26 00:00:00', '2024-05-26 00:00:00'),
(245, 20, NULL, '2024-03-31 00:00:00', 7323.32, 10, 2, '2024-03-31 00:00:00', '2024-03-31 00:00:00'),
(246, 20, NULL, '2024-04-22 00:00:00', 5596.36, 2, 1, '2024-04-22 00:00:00', '2024-04-22 00:00:00'),
(247, 20, NULL, '2024-03-01 00:00:00', 4813.11, 4, 2, '2024-03-01 00:00:00', '2024-03-01 00:00:00'),
(248, 20, NULL, '2024-03-21 00:00:00', 8406.0, 10, 3, '2024-03-21 00:00:00', '2024-03-21 00:00:00');

-- Continue pattern for remaining users (5-20)
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `order_items`
--
DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `variant_id` int NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  KEY `variant_id` (`variant_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
(36, 36, 56, 12, 1, 599.00, 0.00),

(37, 49, 47, 5, 3, 2603.71, 260.37),
(38, 50, 47, 1, 3, 2116.65, 211.67),
(39, 51, 47, 4, 1, 8978.89, 897.89),
(40, 52, 47, 4, 1, 7174.44, 717.44),
(41, 53, 47, 1, 3, 917.78, 91.78),
(42, 54, 47, 4, 1, 5945.18, 594.52),
(43, 55, 48, 5, 2, 1391.83, 139.18),
(44, 56, 48, 1, 1, 2039.64, 203.96),
(45, 57, 48, 2, 3, 3081.89, 308.19),
(46, 58, 48, 1, 2, 767.9, 76.79),
(47, 59, 48, 4, 2, 4207.78, 420.78),
(48, 60, 48, 3, 2, 699.24, 69.92),
(49, 61, 49, 5, 2, 4618.72, 461.87),
(50, 62, 49, 1, 1, 3195.21, 319.52),
(51, 63, 49, 5, 2, 2050.77, 205.08),
(52, 64, 49, 5, 1, 3407.41, 340.74),
(53, 65, 49, 1, 3, 1697.28, 169.73),
(54, 66, 49, 1, 3, 3303.15, 330.32),
(55, 67, 50, 3, 3, 2897.73, 289.77),
(56, 68, 50, 2, 3, 490.09, 49.01),
(57, 69, 50, 1, 3, 521.1, 52.11),
(58, 70, 50, 1, 3, 530.2, 53.02),
(59, 71, 50, 4, 2, 1487.64, 148.76),
(60, 72, 50, 4, 2, 2530.81, 253.08),
(61, 73, 51, 3, 1, 3554.57, 355.46),
(62, 74, 51, 1, 3, 2367.99, 236.8),
(63, 75, 51, 3, 1, 6472.42, 647.24),
(64, 76, 51, 5, 2, 3292.78, 329.28),
(65, 77, 51, 4, 2, 4965.31, 496.53),
(66, 78, 51, 1, 3, 1652.85, 165.28),
(67, 79, 52, 3, 3, 1583.78, 158.38),
(68, 80, 52, 3, 3, 1700.97, 170.1),
(69, 81, 52, 4, 3, 2219.92, 221.99),
(70, 82, 52, 3, 1, 6206.62, 620.66),
(71, 83, 52, 2, 2, 3000.47, 300.05),
(72, 84, 52, 4, 3, 2043.48, 204.35),
(73, 85, 53, 5, 3, 2549.87, 254.99),
(74, 86, 53, 5, 1, 9958.03, 995.8),
(75, 87, 53, 5, 2, 1839.41, 183.94),
(76, 88, 53, 4, 2, 3208.36, 320.84),
(77, 89, 53, 4, 3, 2021.65, 202.17),
(78, 90, 53, 1, 1, 7532.6, 753.26),
(79, 91, 54, 5, 2, 3755.11, 375.51),
(80, 92, 54, 4, 2, 3355.13, 335.51),
(81, 93, 54, 3, 3, 2832.02, 283.2),
(82, 94, 54, 5, 2, 3471.42, 347.14),
(83, 95, 54, 4, 1, 9802.93, 980.29),
(84, 96, 54, 1, 2, 1413.92, 141.39),
(85, 97, 55, 5, 3, 2177.08, 217.71),
(86, 98, 55, 5, 3, 998.4, 99.84),
(87, 99, 55, 2, 3, 3202.77, 320.28),
(88, 100, 55, 3, 2, 2252.66, 225.27),
(89, 101, 55, 4, 2, 2361.32, 236.13),
(90, 102, 55, 4, 2, 2469.37, 246.94),
(91, 103, 56, 4, 1, 9194.41, 919.44),
(92, 104, 56, 5, 3, 2164.98, 216.5),
(93, 105, 56, 5, 2, 3220.39, 322.04),
(94, 106, 56, 3, 1, 8604.51, 860.45),
(95, 107, 56, 3, 1, 4287.54, 428.75),
(96, 108, 56, 2, 3, 2637.75, 263.78),
(97, 109, 57, 1, 1, 1242.27, 124.23),
(98, 110, 57, 1, 3, 1496.75, 149.68),
(99, 111, 57, 1, 3, 1418.78, 141.88),
(100, 112, 57, 3, 3, 2971.7, 297.17),
(101, 113, 57, 3, 3, 3163.9, 316.39),
(102, 114, 57, 3, 3, 2986.28, 298.63),
(103, 115, 58, 4, 1, 8784.45, 878.45),
(104, 116, 58, 3, 1, 8898.83, 889.88),
(105, 117, 58, 2, 2, 3266.09, 326.61),
(106, 118, 58, 3, 1, 4951.68, 495.17),
(107, 119, 58, 4, 1, 2169.68, 216.97),
(108, 120, 58, 3, 3, 2917.28, 291.73),
(109, 121, 59, 2, 1, 6234.91, 623.49),
(110, 122, 59, 2, 2, 3088.67, 308.87),
(111, 123, 59, 5, 2, 3550.32, 355.03),
(112, 124, 59, 3, 3, 3128.15, 312.82),
(113, 125, 59, 1, 1, 5472.94, 547.29),
(114, 126, 59, 2, 1, 3802.07, 380.21),
(115, 127, 60, 5, 1, 6916.9, 691.69),
(116, 128, 60, 2, 3, 2704.12, 270.41),
(117, 129, 60, 1, 2, 2667.84, 266.78),
(118, 130, 60, 2, 1, 3214.0, 321.4),
(119, 131, 60, 3, 3, 978.91, 97.89),
(120, 132, 60, 1, 3, 1438.49, 143.85),
(121, 133, 60, 3, 1, 6071.64, 607.16),
(122, 134, 61, 4, 2, 1400.23, 140.02),
(123, 135, 61, 4, 3, 2767.8, 276.78),
(124, 136, 61, 5, 2, 4346.48, 434.65),
(125, 137, 61, 1, 2, 1207.14, 120.71),
(126, 138, 61, 2, 3, 2353.52, 235.35),
(127, 139, 61, 3, 3, 2770.24, 277.02),
(128, 140, 62, 3, 2, 1730.56, 173.06),
(129, 141, 62, 2, 2, 2384.33, 238.43),
(130, 142, 62, 3, 3, 3130.12, 313.01),
(131, 143, 62, 3, 3, 1476.83, 147.68),
(132, 144, 62, 2, 3, 345.52, 34.55),
(133, 145, 62, 2, 1, 3769.3, 376.93),
(134, 146, 63, 5, 3, 772.86, 77.29),
(135, 147, 63, 5, 2, 1478.04, 147.8),
(136, 148, 63, 3, 3, 399.93, 39.99),
(137, 149, 63, 5, 3, 3276.28, 327.63),
(138, 150, 63, 5, 2, 4318.31, 431.83),
(139, 151, 63, 2, 2, 1613.7, 161.37),
(140, 152, 64, 4, 2, 625.89, 62.59),
(141, 153, 64, 5, 3, 658.37, 65.84),
(142, 154, 64, 3, 3, 1389.69, 138.97),
(143, 155, 64, 3, 2, 2080.68, 208.07),
(144, 156, 64, 2, 2, 3937.47, 393.75),
(145, 157, 64, 2, 3, 1823.13, 182.31),
(146, 158, 65, 3, 2, 3415.39, 341.54),
(147, 159, 65, 1, 1, 7164.74, 716.47),
(148, 160, 65, 3, 1, 8090.42, 809.04),
(149, 161, 65, 5, 1, 3510.95, 351.1),
(150, 162, 65, 4, 2, 2722.7, 272.27),
(151, 163, 65, 2, 2, 2633.06, 263.31),
(152, 164, 66, 3, 2, 1467.52, 146.75),
(153, 165, 66, 3, 2, 1344.17, 134.42),
(154, 166, 66, 2, 1, 1744.49, 174.45),
(155, 167, 66, 5, 1, 1440.47, 144.05),
(156, 168, 66, 5, 1, 6860.51, 686.05),
(157, 169, 66, 5, 1, 1520.54, 152.05),
(158, 170, 83, 3, 1, 2644.16, 264.42),
(159, 171, 83, 3, 3, 500.28, 50.03),
(160, 172, 83, 4, 2, 1783.63, 178.36),
(161, 173, 83, 4, 3, 1867.11, 186.71),
(162, 174, 83, 2, 1, 7402.11, 740.21),
(163, 175, 83, 1, 2, 1082.94, 108.29),
(164, 176, 84, 4, 3, 1671.08, 167.11),
(165, 177, 84, 2, 1, 6783.67, 678.37),
(166, 178, 84, 4, 2, 1879.89, 187.99),
(167, 179, 84, 2, 1, 9658.76, 965.88),
(168, 180, 84, 4, 1, 4981.42, 498.14),
(169, 181, 84, 3, 2, 3050.43, 305.04),
(170, 182, 85, 3, 3, 387.26, 38.73),
(171, 183, 85, 5, 3, 3252.65, 325.27),
(172, 184, 85, 4, 2, 662.77, 66.28),
(173, 185, 85, 3, 1, 3597.59, 359.76),
(174, 186, 85, 1, 1, 5285.18, 528.52),
(175, 187, 85, 5, 1, 4412.19, 441.22),
(176, 188, 86, 3, 1, 6041.69, 604.17),
(177, 189, 86, 2, 3, 1185.84, 118.58),
(178, 190, 86, 4, 2, 3238.16, 323.82),
(179, 191, 86, 4, 2, 3916.27, 391.63),
(180, 192, 86, 5, 1, 4568.36, 456.84),
(181, 193, 86, 3, 2, 869.79, 86.98),
(182, 194, 87, 1, 1, 9058.48, 905.85),
(183, 195, 87, 1, 1, 7555.51, 755.55),
(184, 196, 87, 4, 1, 6912.37, 691.24),
(185, 197, 87, 1, 3, 683.8, 68.38),
(186, 198, 87, 3, 3, 980.37, 98.04),
(187, 199, 87, 3, 2, 4453.79, 445.38),
(188, 200, 87, 3, 3, 501.87, 50.19),
(189, 201, 88, 1, 2, 3113.93, 311.39),
(190, 202, 88, 1, 3, 1546.59, 154.66),
(191, 203, 88, 2, 2, 696.36, 69.64),
(192, 204, 88, 1, 1, 4074.61, 407.46),
(193, 205, 88, 5, 3, 3133.29, 313.33),
(194, 206, 88, 4, 3, 749.46, 74.95),
(195, 207, 89, 3, 3, 2603.02, 260.3),
(196, 208, 89, 2, 1, 2998.23, 299.82),
(197, 209, 89, 1, 3, 1386.42, 138.64),
(198, 210, 89, 2, 2, 3696.01, 369.6),
(199, 211, 89, 5, 2, 4259.4, 425.94),
(200, 212, 89, 4, 2, 2628.64, 262.86),
(201, 213, 90, 4, 3, 2526.59, 252.66),
(202, 214, 90, 4, 2, 4290.16, 429.02),
(203, 215, 90, 2, 3, 892.34, 89.23),
(204, 216, 90, 5, 3, 1432.17, 143.22),
(205, 217, 90, 5, 1, 2849.26, 284.93),
(206, 218, 90, 1, 3, 2797.31, 279.73),
(207, 219, 91, 3, 2, 2395.59, 239.56),
(208, 220, 91, 2, 3, 2594.02, 259.4),
(209, 221, 91, 3, 1, 9760.38, 976.04),
(210, 222, 91, 1, 3, 1547.88, 154.79),
(211, 223, 91, 5, 1, 4086.58, 408.66),
(212, 224, 91, 5, 2, 3506.47, 350.65),
(213, 225, 92, 2, 2, 3017.66, 301.77),
(214, 226, 92, 5, 3, 1368.64, 136.86),
(215, 227, 92, 5, 3, 432.96, 43.3),
(216, 228, 92, 2, 1, 6320.53, 632.05),
(217, 229, 92, 3, 1, 2557.8, 255.78),
(218, 230, 92, 2, 1, 9325.8, 932.58),
(219, 231, 93, 2, 2, 4460.07, 446.01),
(220, 232, 93, 4, 3, 363.23, 36.32),
(221, 233, 93, 5, 2, 3257.03, 325.7),
(222, 234, 93, 3, 2, 4166.69, 416.67),
(223, 235, 93, 3, 2, 1437.09, 143.71),
(224, 236, 93, 2, 1, 7742.77, 774.28),
(225, 237, 94, 1, 2, 1573.44, 157.34),
(226, 238, 94, 4, 2, 3313.64, 331.36),
(227, 239, 94, 5, 3, 732.41, 73.24),
(228, 240, 94, 4, 3, 3170.75, 317.08),
(229, 241, 94, 4, 1, 1186.22, 118.62),
(230, 242, 94, 2, 2, 733.27, 73.33),
(231, 243, 94, 2, 1, 6211.28, 621.13),
(232, 244, 41, 4, 2, 4984.23, 498.42),
(233, 245, 42, 2, 1, 7323.32, 732.33),
(234, 246, 43, 4, 1, 5596.36, 559.64),
(235, 247, 44, 3, 3, 1604.37, 160.44),
(236, 248, 45, 5, 2, 4203.0, 420.3);

-- Continue pattern for remaining users (4-20)
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `user_id` int NOT NULL,
  `payment_method_id` int NOT NULL,
  `payment_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `payment_proof_url` VARCHAR(255), -- URL or path to uploaded image
  `payment_status` VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, etc.
  `reference_number` TEXT, 
  PRIMARY KEY (`payment_id`),
  KEY `order_id` (`order_id`),
  KEY `payment_method_id` (`payment_method_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`payment_method_id`),
  CONSTRAINT `payment_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


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
(24, 24, 2, 1, '2025-05-31 21:00:00', '/static/payments/payment24.jpg', 'completed', 'REF024'),
(25, 49, 1, 1, '2024-03-04 00:00:00', 'proof_url_25.jpg', 'Completed', 'REF25'),
(26, 50, 1, 3, '2024-03-27 00:00:00', 'proof_url_26.jpg', 'Completed', 'REF26'),
(27, 51, 1, 1, '2024-03-10 00:00:00', 'proof_url_27.jpg', 'Completed', 'REF27'),
(28, 52, 1, 2, '2024-03-16 00:00:00', 'proof_url_28.jpg', 'Completed', 'REF28'),
(29, 53, 1, 1, '2024-04-21 00:00:00', 'proof_url_29.jpg', 'Completed', 'REF29'),
(30, 54, 1, 2, '2024-05-15 00:00:00', 'proof_url_30.jpg', 'Completed', 'REF30'),
(31, 55, 1, 3, '2024-05-09 00:00:00', 'proof_url_31.jpg', 'Completed', 'REF31'),
(32, 56, 1, 1, '2024-05-26 00:00:00', 'proof_url_32.jpg', 'Completed', 'REF32'),
(33, 57, 1, 3, '2024-05-30 00:00:00', 'proof_url_33.jpg', 'Completed', 'REF33'),
(34, 58, 1, 2, '2024-04-19 00:00:00', 'proof_url_34.jpg', 'Completed', 'REF34'),
(35, 59, 2, 2, '2024-03-05 00:00:00', 'proof_url_35.jpg', 'Completed', 'REF35'),
(36, 60, 2, 2, '2024-04-10 00:00:00', 'proof_url_36.jpg', 'Completed', 'REF36'),
(37, 61, 2, 3, '2024-03-22 00:00:00', 'proof_url_37.jpg', 'Completed', 'REF37'),
(38, 62, 2, 3, '2024-04-04 00:00:00', 'proof_url_38.jpg', 'Completed', 'REF38'),
(39, 63, 2, 3, '2024-03-01 00:00:00', 'proof_url_39.jpg', 'Completed', 'REF39'),
(40, 64, 2, 3, '2024-03-07 00:00:00', 'proof_url_40.jpg', 'Completed', 'REF40'),
(41, 65, 2, 2, '2024-04-24 00:00:00', 'proof_url_41.jpg', 'Completed', 'REF41'),
(42, 66, 2, 2, '2024-05-23 00:00:00', 'proof_url_42.jpg', 'Completed', 'REF42'),
(43, 67, 2, 1, '2024-04-15 00:00:00', 'proof_url_43.jpg', 'Completed', 'REF43'),
(44, 68, 2, 2, '2024-05-08 00:00:00', 'proof_url_44.jpg', 'Completed', 'REF44'),
(45, 69, 3, 2, '2024-05-07 00:00:00', 'proof_url_45.jpg', 'Completed', 'REF45'),
(46, 70, 3, 1, '2024-04-10 00:00:00', 'proof_url_46.jpg', 'Completed', 'REF46'),
(47, 71, 3, 3, '2024-05-23 00:00:00', 'proof_url_47.jpg', 'Completed', 'REF47'),
(48, 72, 3, 1, '2024-05-21 00:00:00', 'proof_url_48.jpg', 'Completed', 'REF48'),
(49, 73, 3, 3, '2024-03-09 00:00:00', 'proof_url_49.jpg', 'Completed', 'REF49'),
(50, 74, 3, 3, '2024-05-30 00:00:00', 'proof_url_50.jpg', 'Completed', 'REF50'),
(51, 75, 3, 3, '2024-05-21 00:00:00', 'proof_url_51.jpg', 'Completed', 'REF51'),
(52, 76, 3, 2, '2024-05-26 00:00:00', 'proof_url_52.jpg', 'Completed', 'REF52'),
(53, 77, 3, 1, '2024-04-07 00:00:00', 'proof_url_53.jpg', 'Completed', 'REF53'),
(54, 78, 3, 2, '2024-04-13 00:00:00', 'proof_url_54.jpg', 'Completed', 'REF54'),
(55, 79, 4, 1, '2024-04-13 00:00:00', 'proof_url_55.jpg', 'Completed', 'REF55'),
(56, 80, 4, 3, '2024-03-05 00:00:00', 'proof_url_56.jpg', 'Completed', 'REF56'),
(57, 81, 4, 3, '2024-05-15 00:00:00', 'proof_url_57.jpg', 'Completed', 'REF57'),
(58, 82, 4, 3, '2024-04-11 00:00:00', 'proof_url_58.jpg', 'Completed', 'REF58'),
(59, 83, 4, 1, '2024-05-09 00:00:00', 'proof_url_59.jpg', 'Completed', 'REF59'),
(60, 84, 4, 2, '2024-03-11 00:00:00', 'proof_url_60.jpg', 'Completed', 'REF60'),
(61, 85, 4, 1, '2024-03-19 00:00:00', 'proof_url_61.jpg', 'Completed', 'REF61'),
(62, 86, 4, 1, '2024-04-22 00:00:00', 'proof_url_62.jpg', 'Completed', 'REF62'),
(63, 87, 4, 3, '2024-03-20 00:00:00', 'proof_url_63.jpg', 'Completed', 'REF63'),
(64, 88, 4, 1, '2024-03-31 00:00:00', 'proof_url_64.jpg', 'Completed', 'REF64'),
(65, 89, 5, 3, '2024-04-19 00:00:00', 'proof_url_65.jpg', 'Completed', 'REF65'),
(66, 90, 5, 1, '2024-03-22 00:00:00', 'proof_url_66.jpg', 'Completed', 'REF66'),
(67, 91, 5, 2, '2024-04-27 00:00:00', 'proof_url_67.jpg', 'Completed', 'REF67'),
(68, 92, 5, 1, '2024-05-31 00:00:00', 'proof_url_68.jpg', 'Completed', 'REF68'),
(69, 93, 5, 2, '2024-04-08 00:00:00', 'proof_url_69.jpg', 'Completed', 'REF69'),
(70, 94, 5, 2, '2024-05-15 00:00:00', 'proof_url_70.jpg', 'Completed', 'REF70'),
(71, 95, 5, 2, '2024-04-23 00:00:00', 'proof_url_71.jpg', 'Completed', 'REF71'),
(72, 96, 5, 1, '2024-04-04 00:00:00', 'proof_url_72.jpg', 'Completed', 'REF72'),
(73, 97, 5, 2, '2024-03-17 00:00:00', 'proof_url_73.jpg', 'Completed', 'REF73'),
(74, 98, 5, 3, '2024-04-27 00:00:00', 'proof_url_74.jpg', 'Completed', 'REF74'),
(75, 99, 6, 3, '2024-03-06 00:00:00', 'proof_url_75.jpg', 'Completed', 'REF75'),
(76, 100, 6, 2, '2024-03-09 00:00:00', 'proof_url_76.jpg', 'Completed', 'REF76'),
(77, 101, 6, 1, '2024-03-06 00:00:00', 'proof_url_77.jpg', 'Completed', 'REF77'),
(78, 102, 6, 1, '2024-04-27 00:00:00', 'proof_url_78.jpg', 'Completed', 'REF78'),
(79, 103, 6, 3, '2024-03-06 00:00:00', 'proof_url_79.jpg', 'Completed', 'REF79'),
(80, 104, 6, 2, '2024-05-11 00:00:00', 'proof_url_80.jpg', 'Completed', 'REF80'),
(81, 105, 6, 1, '2024-03-05 00:00:00', 'proof_url_81.jpg', 'Completed', 'REF81'),
(82, 106, 6, 2, '2024-05-06 00:00:00', 'proof_url_82.jpg', 'Completed', 'REF82'),
(83, 107, 6, 2, '2024-04-22 00:00:00', 'proof_url_83.jpg', 'Completed', 'REF83'),
(84, 108, 6, 3, '2024-03-25 00:00:00', 'proof_url_84.jpg', 'Completed', 'REF84'),
(85, 109, 7, 2, '2024-05-19 00:00:00', 'proof_url_85.jpg', 'Completed', 'REF85'),
(86, 110, 7, 1, '2024-05-08 00:00:00', 'proof_url_86.jpg', 'Completed', 'REF86'),
(87, 111, 7, 3, '2024-03-23 00:00:00', 'proof_url_87.jpg', 'Completed', 'REF87'),
(88, 112, 7, 2, '2024-05-27 00:00:00', 'proof_url_88.jpg', 'Completed', 'REF88'),
(89, 113, 7, 1, '2024-03-18 00:00:00', 'proof_url_89.jpg', 'Completed', 'REF89'),
(90, 114, 7, 3, '2024-05-12 00:00:00', 'proof_url_90.jpg', 'Completed', 'REF90'),
(91, 115, 7, 3, '2024-05-04 00:00:00', 'proof_url_91.jpg', 'Completed', 'REF91'),
(92, 116, 7, 3, '2024-04-07 00:00:00', 'proof_url_92.jpg', 'Completed', 'REF92'),
(93, 117, 7, 3, '2024-03-16 00:00:00', 'proof_url_93.jpg', 'Completed', 'REF93'),
(94, 118, 7, 2, '2024-03-18 00:00:00', 'proof_url_94.jpg', 'Completed', 'REF94'),
(95, 119, 8, 2, '2024-05-27 00:00:00', 'proof_url_95.jpg', 'Completed', 'REF95'),
(96, 120, 8, 3, '2024-04-02 00:00:00', 'proof_url_96.jpg', 'Completed', 'REF96'),
(97, 121, 8, 3, '2024-05-08 00:00:00', 'proof_url_97.jpg', 'Completed', 'REF97'),
(98, 122, 8, 2, '2024-04-24 00:00:00', 'proof_url_98.jpg', 'Completed', 'REF98'),
(99, 123, 8, 1, '2024-03-14 00:00:00', 'proof_url_99.jpg', 'Completed', 'REF99'),
(100, 124, 8, 2, '2024-03-07 00:00:00', 'proof_url_100.jpg', 'Completed', 'REF100'),
(101, 125, 8, 2, '2024-03-24 00:00:00', 'proof_url_101.jpg', 'Completed', 'REF101'),
(102, 126, 8, 2, '2024-05-23 00:00:00', 'proof_url_102.jpg', 'Completed', 'REF102'),
(103, 127, 8, 1, '2024-04-13 00:00:00', 'proof_url_103.jpg', 'Completed', 'REF103'),
(104, 128, 8, 2, '2024-04-05 00:00:00', 'proof_url_104.jpg', 'Completed', 'REF104'),
(105, 129, 9, 1, '2024-05-18 00:00:00', 'proof_url_105.jpg', 'Completed', 'REF105'),
(106, 130, 9, 1, '2024-03-01 00:00:00', 'proof_url_106.jpg', 'Completed', 'REF106'),
(107, 131, 9, 1, '2024-04-15 00:00:00', 'proof_url_107.jpg', 'Completed', 'REF107'),
(108, 132, 9, 1, '2024-05-16 00:00:00', 'proof_url_108.jpg', 'Completed', 'REF108'),
(109, 133, 9, 3, '2024-03-14 00:00:00', 'proof_url_109.jpg', 'Completed', 'REF109'),
(110, 134, 9, 3, '2024-05-03 00:00:00', 'proof_url_110.jpg', 'Completed', 'REF110'),
(111, 135, 9, 1, '2024-05-08 00:00:00', 'proof_url_111.jpg', 'Completed', 'REF111'),
(112, 136, 9, 3, '2024-05-31 00:00:00', 'proof_url_112.jpg', 'Completed', 'REF112'),
(113, 137, 9, 1, '2024-04-22 00:00:00', 'proof_url_113.jpg', 'Completed', 'REF113'),
(114, 138, 9, 2, '2024-05-20 00:00:00', 'proof_url_114.jpg', 'Completed', 'REF114'),
(115, 139, 10, 2, '2024-05-31 00:00:00', 'proof_url_115.jpg', 'Completed', 'REF115'),
(116, 140, 10, 2, '2024-04-01 00:00:00', 'proof_url_116.jpg', 'Completed', 'REF116'),
(117, 141, 10, 2, '2024-03-16 00:00:00', 'proof_url_117.jpg', 'Completed', 'REF117'),
(118, 142, 10, 1, '2024-03-19 00:00:00', 'proof_url_118.jpg', 'Completed', 'REF118'),
(119, 143, 10, 1, '2024-05-04 00:00:00', 'proof_url_119.jpg', 'Completed', 'REF119'),
(120, 144, 10, 2, '2024-04-25 00:00:00', 'proof_url_120.jpg', 'Completed', 'REF120'),
(121, 145, 10, 3, '2024-05-08 00:00:00', 'proof_url_121.jpg', 'Completed', 'REF121'),
(122, 146, 10, 2, '2024-03-06 00:00:00', 'proof_url_122.jpg', 'Completed', 'REF122'),
(123, 147, 10, 2, '2024-05-03 00:00:00', 'proof_url_123.jpg', 'Completed', 'REF123'),
(124, 148, 10, 2, '2024-04-23 00:00:00', 'proof_url_124.jpg', 'Completed', 'REF124'),
(125, 149, 11, 3, '2024-04-16 00:00:00', 'proof_url_125.jpg', 'Completed', 'REF125'),
(126, 150, 11, 2, '2024-03-15 00:00:00', 'proof_url_126.jpg', 'Completed', 'REF126'),
(127, 151, 11, 1, '2024-03-28 00:00:00', 'proof_url_127.jpg', 'Completed', 'REF127'),
(128, 152, 11, 3, '2024-05-03 00:00:00', 'proof_url_128.jpg', 'Completed', 'REF128'),
(129, 153, 11, 1, '2024-04-29 00:00:00', 'proof_url_129.jpg', 'Completed', 'REF129'),
(130, 154, 11, 1, '2024-04-06 00:00:00', 'proof_url_130.jpg', 'Completed', 'REF130'),
(131, 155, 11, 1, '2024-05-12 00:00:00', 'proof_url_131.jpg', 'Completed', 'REF131'),
(132, 156, 11, 2, '2024-04-23 00:00:00', 'proof_url_132.jpg', 'Completed', 'REF132'),
(133, 157, 11, 1, '2024-04-28 00:00:00', 'proof_url_133.jpg', 'Completed', 'REF133'),
(134, 158, 11, 2, '2024-05-15 00:00:00', 'proof_url_134.jpg', 'Completed', 'REF134'),
(135, 159, 12, 3, '2024-04-27 00:00:00', 'proof_url_135.jpg', 'Completed', 'REF135'),
(136, 160, 12, 1, '2024-04-25 00:00:00', 'proof_url_136.jpg', 'Completed', 'REF136'),
(137, 161, 12, 3, '2024-03-20 00:00:00', 'proof_url_137.jpg', 'Completed', 'REF137'),
(138, 162, 12, 3, '2024-05-18 00:00:00', 'proof_url_138.jpg', 'Completed', 'REF138'),
(139, 163, 12, 2, '2024-03-27 00:00:00', 'proof_url_139.jpg', 'Completed', 'REF139'),
(140, 164, 12, 1, '2024-03-02 00:00:00', 'proof_url_140.jpg', 'Completed', 'REF140'),
(141, 165, 12, 1, '2024-03-04 00:00:00', 'proof_url_141.jpg', 'Completed', 'REF141'),
(142, 166, 12, 3, '2024-04-24 00:00:00', 'proof_url_142.jpg', 'Completed', 'REF142'),
(143, 167, 12, 1, '2024-05-28 00:00:00', 'proof_url_143.jpg', 'Completed', 'REF143'),
(144, 168, 12, 3, '2024-04-23 00:00:00', 'proof_url_144.jpg', 'Completed', 'REF144'),
(145, 169, 13, 1, '2024-03-11 00:00:00', 'proof_url_145.jpg', 'Completed', 'REF145'),
(146, 170, 13, 2, '2024-05-04 00:00:00', 'proof_url_146.jpg', 'Completed', 'REF146'),
(147, 171, 13, 3, '2024-05-23 00:00:00', 'proof_url_147.jpg', 'Completed', 'REF147'),
(148, 172, 13, 1, '2024-05-08 00:00:00', 'proof_url_148.jpg', 'Completed', 'REF148'),
(149, 173, 13, 1, '2024-03-23 00:00:00', 'proof_url_149.jpg', 'Completed', 'REF149'),
(150, 174, 13, 2, '2024-04-23 00:00:00', 'proof_url_150.jpg', 'Completed', 'REF150'),
(151, 175, 13, 3, '2024-03-03 00:00:00', 'proof_url_151.jpg', 'Completed', 'REF151'),
(152, 176, 13, 2, '2024-05-09 00:00:00', 'proof_url_152.jpg', 'Completed', 'REF152'),
(153, 177, 13, 2, '2024-03-30 00:00:00', 'proof_url_153.jpg', 'Completed', 'REF153'),
(154, 178, 13, 2, '2024-03-20 00:00:00', 'proof_url_154.jpg', 'Completed', 'REF154'),
(155, 179, 14, 1, '2024-04-27 00:00:00', 'proof_url_155.jpg', 'Completed', 'REF155'),
(156, 180, 14, 3, '2024-05-27 00:00:00', 'proof_url_156.jpg', 'Completed', 'REF156'),
(157, 181, 14, 2, '2024-04-08 00:00:00', 'proof_url_157.jpg', 'Completed', 'REF157'),
(158, 182, 14, 3, '2024-05-21 00:00:00', 'proof_url_158.jpg', 'Completed', 'REF158'),
(159, 183, 14, 1, '2024-05-28 00:00:00', 'proof_url_159.jpg', 'Completed', 'REF159'),
(160, 184, 14, 2, '2024-04-11 00:00:00', 'proof_url_160.jpg', 'Completed', 'REF160'),
(161, 185, 14, 1, '2024-03-07 00:00:00', 'proof_url_161.jpg', 'Completed', 'REF161'),
(162, 186, 14, 2, '2024-03-16 00:00:00', 'proof_url_162.jpg', 'Completed', 'REF162'),
(163, 187, 14, 2, '2024-03-16 00:00:00', 'proof_url_163.jpg', 'Completed', 'REF163'),
(164, 188, 14, 2, '2024-05-29 00:00:00', 'proof_url_164.jpg', 'Completed', 'REF164'),
(165, 189, 15, 3, '2024-05-13 00:00:00', 'proof_url_165.jpg', 'Completed', 'REF165'),
(166, 190, 15, 2, '2024-03-15 00:00:00', 'proof_url_166.jpg', 'Completed', 'REF166'),
(167, 191, 15, 1, '2024-03-11 00:00:00', 'proof_url_167.jpg', 'Completed', 'REF167'),
(168, 192, 15, 2, '2024-04-15 00:00:00', 'proof_url_168.jpg', 'Completed', 'REF168'),
(169, 193, 15, 3, '2024-04-15 00:00:00', 'proof_url_169.jpg', 'Completed', 'REF169'),
(170, 194, 15, 1, '2024-03-14 00:00:00', 'proof_url_170.jpg', 'Completed', 'REF170'),
(171, 195, 15, 1, '2024-04-29 00:00:00', 'proof_url_171.jpg', 'Completed', 'REF171'),
(172, 196, 15, 3, '2024-05-20 00:00:00', 'proof_url_172.jpg', 'Completed', 'REF172'),
(173, 197, 15, 3, '2024-03-14 00:00:00', 'proof_url_173.jpg', 'Completed', 'REF173'),
(174, 198, 15, 1, '2024-05-06 00:00:00', 'proof_url_174.jpg', 'Completed', 'REF174'),
(175, 199, 16, 1, '2024-05-18 00:00:00', 'proof_url_175.jpg', 'Completed', 'REF175'),
(176, 200, 16, 1, '2024-05-31 00:00:00', 'proof_url_176.jpg', 'Completed', 'REF176'),
(177, 201, 16, 1, '2024-04-13 00:00:00', 'proof_url_177.jpg', 'Completed', 'REF177'),
(178, 202, 16, 3, '2024-03-12 00:00:00', 'proof_url_178.jpg', 'Completed', 'REF178'),
(179, 203, 16, 1, '2024-03-14 00:00:00', 'proof_url_179.jpg', 'Completed', 'REF179'),
(180, 204, 16, 3, '2024-05-24 00:00:00', 'proof_url_180.jpg', 'Completed', 'REF180'),
(181, 205, 16, 2, '2024-05-25 00:00:00', 'proof_url_181.jpg', 'Completed', 'REF181'),
(182, 206, 16, 1, '2024-04-14 00:00:00', 'proof_url_182.jpg', 'Completed', 'REF182'),
(183, 207, 16, 3, '2024-05-31 00:00:00', 'proof_url_183.jpg', 'Completed', 'REF183'),
(184, 208, 16, 3, '2024-04-26 00:00:00', 'proof_url_184.jpg', 'Completed', 'REF184'),
(185, 209, 17, 2, '2024-03-25 00:00:00', 'proof_url_185.jpg', 'Completed', 'REF185'),
(186, 210, 17, 2, '2024-04-08 00:00:00', 'proof_url_186.jpg', 'Completed', 'REF186'),
(187, 211, 17, 2, '2024-04-10 00:00:00', 'proof_url_187.jpg', 'Completed', 'REF187'),
(188, 212, 17, 3, '2024-05-05 00:00:00', 'proof_url_188.jpg', 'Completed', 'REF188'),
(189, 213, 17, 2, '2024-04-21 00:00:00', 'proof_url_189.jpg', 'Completed', 'REF189'),
(190, 214, 17, 3, '2024-05-07 00:00:00', 'proof_url_190.jpg', 'Completed', 'REF190'),
(191, 215, 17, 1, '2024-05-04 00:00:00', 'proof_url_191.jpg', 'Completed', 'REF191'),
(192, 216, 17, 2, '2024-03-03 00:00:00', 'proof_url_192.jpg', 'Completed', 'REF192'),
(193, 217, 17, 3, '2024-03-09 00:00:00', 'proof_url_193.jpg', 'Completed', 'REF193'),
(194, 218, 17, 2, '2024-05-22 00:00:00', 'proof_url_194.jpg', 'Completed', 'REF194'),
(195, 219, 18, 3, '2024-03-19 00:00:00', 'proof_url_195.jpg', 'Completed', 'REF195'),
(196, 220, 18, 2, '2024-04-24 00:00:00', 'proof_url_196.jpg', 'Completed', 'REF196'),
(197, 221, 18, 3, '2024-05-09 00:00:00', 'proof_url_197.jpg', 'Completed', 'REF197'),
(198, 222, 18, 3, '2024-05-02 00:00:00', 'proof_url_198.jpg', 'Completed', 'REF198'),
(199, 223, 18, 3, '2024-05-03 00:00:00', 'proof_url_199.jpg', 'Completed', 'REF199'),
(200, 224, 18, 2, '2024-03-01 00:00:00', 'proof_url_200.jpg', 'Completed', 'REF200'),
(201, 225, 18, 2, '2024-05-29 00:00:00', 'proof_url_201.jpg', 'Completed', 'REF201'),
(202, 226, 18, 1, '2024-04-20 00:00:00', 'proof_url_202.jpg', 'Completed', 'REF202'),
(203, 227, 18, 2, '2024-04-23 00:00:00', 'proof_url_203.jpg', 'Completed', 'REF203'),
(204, 228, 18, 1, '2024-05-08 00:00:00', 'proof_url_204.jpg', 'Completed', 'REF204'),
(205, 229, 19, 2, '2024-04-20 00:00:00', 'proof_url_205.jpg', 'Completed', 'REF205'),
(206, 230, 19, 3, '2024-04-10 00:00:00', 'proof_url_206.jpg', 'Completed', 'REF206'),
(207, 231, 19, 2, '2024-04-07 00:00:00', 'proof_url_207.jpg', 'Completed', 'REF207'),
(208, 232, 19, 1, '2024-04-19 00:00:00', 'proof_url_208.jpg', 'Completed', 'REF208'),
(209, 233, 19, 1, '2024-04-14 00:00:00', 'proof_url_209.jpg', 'Completed', 'REF209'),
(210, 234, 19, 1, '2024-03-21 00:00:00', 'proof_url_210.jpg', 'Completed', 'REF210'),
(211, 235, 19, 3, '2024-05-17 00:00:00', 'proof_url_211.jpg', 'Completed', 'REF211'),
(212, 236, 19, 3, '2024-03-08 00:00:00', 'proof_url_212.jpg', 'Completed', 'REF212'),
(213, 237, 19, 2, '2024-04-15 00:00:00', 'proof_url_213.jpg', 'Completed', 'REF213'),
(214, 238, 19, 2, '2024-04-30 00:00:00', 'proof_url_214.jpg', 'Completed', 'REF214'),
(215, 239, 20, 1, '2024-05-27 00:00:00', 'proof_url_215.jpg', 'Completed', 'REF215'),
(216, 240, 20, 1, '2024-04-04 00:00:00', 'proof_url_216.jpg', 'Completed', 'REF216'),
(217, 241, 20, 3, '2024-03-30 00:00:00', 'proof_url_217.jpg', 'Completed', 'REF217'),
(218, 242, 20, 3, '2024-04-08 00:00:00', 'proof_url_218.jpg', 'Completed', 'REF218'),
(219, 243, 20, 3, '2024-05-28 00:00:00', 'proof_url_219.jpg', 'Completed', 'REF219'),
(220, 244, 20, 3, '2024-05-26 00:00:00', 'proof_url_220.jpg', 'Completed', 'REF220'),
(221, 245, 20, 1, '2024-03-31 00:00:00', 'proof_url_221.jpg', 'Completed', 'REF221'),
(222, 246, 20, 1, '2024-04-22 00:00:00', 'proof_url_222.jpg', 'Completed', 'REF222'),
(223, 247, 20, 2, '2024-03-01 00:00:00', 'proof_url_223.jpg', 'Completed', 'REF223'),
(224, 248, 20, 2, '2024-03-21 00:00:00', 'proof_url_224.jpg', 'Completed', 'REF224');
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
DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `order_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`review_id`),
  KEY `product_id` (`product_id`),
  KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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

DROP TABLE IF EXISTS `review_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_media` (
  `media_id` int NOT NULL AUTO_INCREMENT,
  `review_id` int NOT NULL,
  `media_url` varchar(255) DEFAULT NULL,
  `media_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`media_id`),
  KEY `review_id` (`review_id`),
  CONSTRAINT `review_media_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`review_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
(1, 'Shunfa Sewing Machines and Parts', 'Mr. Shun', '09171234567', 'shunfa@example.com', 'China Town, Manila', 'Active', NOW()),
(2, 'Tai-Sing Industrial Sewing Machine', 'Mr. Tai', '09182345678', 'taising@example.com', 'Makati, Metro Manila', 'Active', NOW()),
(3, 'Skylab Manufacturing', 'Ms. Sky', '09183456789', 'skylab@example.com', 'Valenzuela City', 'Active', NOW()),
(4, 'Quitalig Manufacturing', 'Mr. Quitalig', '09184567890', 'quitalig@example.com', 'Divisoria, Manila', 'Active', NOW()),
(5, 'UNO Sewing Machine and Parts', 'Ms. Uno', '09185678901', 'uno@example.com', 'Quezon City', 'Active', NOW());
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
(1, 41, 1, 15000.00, 1),
(2, 42, 1, 18000.00, 1),
(3, 43, 1, 16000.00, 1),
(4, 44, 1, 17000.00, 1),
(5, 45, 1, 19000.00, 1),
(6, 47, 1, 20000.00, 1),
(7, 48, 1, 8000.00, 1),
(8, 49, 1, 19500.00, 1),

(9, 50, 2, 25000.00, 1),
(10, 51, 2, 26000.00, 1),
(11, 52, 2, 24000.00, 1),
(12, 53, 2, 28000.00, 1),
(13, 54, 2, 30000.00, 1),

(14, 55, 3, 100.00, 1),
(15, 56, 3, 110.00, 1),
(16, 61, 3, 90.00, 1),
(17, 62, 3, 95.00, 1),
(18, 63, 3, 85.00, 1),

(19, 57, 4, 70.00, 1),
(20, 58, 4, 65.00, 1),
(21, 59, 4, 75.00, 1),
(22, 60, 4, 80.00, 1),

(23, 83, 1, 50.00, 1),
(24, 84, 1, 10.00, 1),
(25, 85, 1, 15.00, 1),
(26, 86, 1, 45.00, 1),
(27, 87, 1, 40.00, 1),

(28, 88, 5, 3500.00, 1),
(29, 89, 5, 4000.00, 1),
(30, 90, 5, 2500.00, 1),
(31, 64, 1, 200.00, 1),
(32, 65, 1, 220.00, 1),
(33, 66, 1, 230.00, 1),
(34, 91, 5, 12.00, 1),
(35, 92, 5, 12.00, 1),
(36, 93, 5, 12.00, 1),
(37, 94, 5, 12.00, 1);
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
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO inventory (
    product_id,
    stock_quantity,
    stock_in,
    stock_out,
    min_stock,
    max_stock,
    available_stock,
    stock_status,
    created_at,
    updated_at
) VALUES
(41, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(42, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(43, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(44, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(45, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(47, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(48, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(49, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(50, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(51, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(52, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(53, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(54, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(55, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(56, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(57, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(58, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(59, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW()),
(60, 50, 50, 0,5,100,50,'in_stock', NOW(),NOW());
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
