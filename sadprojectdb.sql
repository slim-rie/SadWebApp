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
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `complete_address` varchar(255) DEFAULT NULL,
  `label` varchar(20) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,1,'John Jerriehl','Pontino','3019','National Capital Region (NCR)','home',1,'2025-05-14 19:25:25','09317649032','Remy 2nd floor'),(2,2,'John Jerriehl','Pontino','3019','National Capital Region (NCR)','home',1,'2025-05-15 07:08:26','09317649032','Remy 2nd floor');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
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
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `brand_id` int NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`brand_id`),
  UNIQUE KEY `name` (`brand_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'SHUNFA','SHUNFA is a leading manufacturer of industrial sewing machines and equipment, known for quality and innovation.'),(2,'Juki','Juki industrial sewing machines'),(3,'Skylab','Local fabric manufacturer'),(4,'Quitalig','Quitalig');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `_user_product_uc` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
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
INSERT INTO `categories` VALUES (1,'Sewing Machines',NULL),(2,'Sewing Parts',NULL),(3,'Fabrics',NULL),(4,'Shunfa Industrial Sewing Machines',1),(5,'Juki Sewing Machines',1),(29,'Silk Fabric',NULL),(30,'Cotton Fabric',NULL),(31,'Polyester-Blend Fabrics',NULL),(32,'Knitted Fabrics',NULL),(33,'Woven Fabrics',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` float NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (69,42,49,1,10999,'2025-05-16 16:06:35'),(70,43,59,1,499,'2025-05-16 16:06:35'),(71,44,61,2,599,'2025-05-16 16:06:35'),(72,45,47,2,10999,'2025-05-16 16:06:35'),(73,46,41,1,8450.75,'2025-05-16 16:06:35'),(74,47,45,1,10999,'2025-05-17 07:34:41');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
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
  `total_amount` float NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` varchar(20) DEFAULT NULL,
  `shipping_address` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `cancellation_reason` varchar(255) DEFAULT NULL,
  `cancellation_requested_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (41,1,10999,'pending','Cash on Delivery','pending','National Capital Region (NCR)','2025-05-17 00:06:35','2025-05-16 16:06:35',NULL,NULL),(42,1,10999,'paid','Cash on Delivery','paid','National Capital Region (NCR)','2025-05-17 00:06:35','2025-05-16 16:06:35',NULL,NULL),(43,1,499,'shipped','Cash on Delivery','paid','National Capital Region (NCR)','2025-05-17 00:06:35','2025-05-16 16:06:35',NULL,NULL),(44,1,1198,'delivered','Cash on Delivery','paid','National Capital Region (NCR)','2025-05-17 00:06:35','2025-05-16 16:06:35',NULL,NULL),(45,1,21998,'cancelled','Cash on Delivery','paid','National Capital Region (NCR)','2025-05-17 00:06:35','2025-05-16 16:06:35',NULL,NULL),(46,1,8450.75,'refunded','Cash on Delivery','paid','National Capital Region (NCR)','2025-05-17 00:06:35','2025-05-16 16:06:35',NULL,NULL),(47,1,11149,'pending','Cash on Delivery','pending','National Capital Region (NCR)','2025-05-17 07:34:41','2025-05-17 07:34:41',NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
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
INSERT INTO `product_images` VALUES (8,43,'/static/pictures/SHUNFA SF-372 Buttonsew machine.jpg','main',0,'SHUNFA SF-372 – Button Sew Machine'),(9,44,'/static/pictures/SHUNFA SF-781 Buttonholer machine.jpg','main',0,'SHUNFA SF-781 – Buttonholer Machine'),(10,45,'/static/pictures/SHUNFA SF-737 – 3-Thread Overlock Machine.jpg','main',0,'SHUNFA SF-737 – 3-Thread Overlock Machine'),(12,47,'/static/pictures/SHUNFA SF-757 – 5-Thread Overlock Machine.jpg','main',0,'SHUNFA SF-757 – 5-Thread Overlock Machine'),(13,48,'/static/pictures/SHUNFA JA2-2 – Household Sewing Machine.jpg','main',0,'SHUNFA JA2-2 – Household Sewing Machine'),(14,49,'/static/pictures/SHUNFA SF-747 – 4-Thread Overlock Machine.jpg','main',0,'SHUNFA SF-747 – 4-Thread Overlock Machine'),(15,50,'/static/pictures/Juki DDL-8100E – Single Needle High-Speed Lockstitch Machine.jpg','main',0,'Juki DDL-8100E – Single Needle High-Speed Lockstitch Machine'),(16,51,'/static/pictures/Juki MO-6700DA Series – Semi-Dry Head Overlock Machine.jpg','main',0,'Juki MO-6700DA Series – Semi-Dry Head Overlock Machine'),(17,52,'/static/pictures/Juki W562-02BB – Piping Machine.jpg','main',0,'Juki W562-02BB – Piping Machine'),(18,53,'/static/pictures/Juki LU-1508N – Walking Foot Lockstitch Machine.jpg','main',0,'Juki LU-1508N – Walking Foot Lockstitch Machine'),(19,54,'/static/pictures/Juki LK-1900S – Computer-Controlled Bartacking Machine.jpg','main',0,'Juki LK-1900S – Computer-Controlled Bartacking Machine'),(20,55,'/static/pictures/Skylab – Lacoste Fabric.jpg','main',0,'Skylab – Lacoste Fabric'),(22,57,'/static/pictures/Quitalig – China Cotton 135 GSM.jpg','main',0,'Quitalig – China Cotton 135 GSM'),(23,58,'/static/pictures/Quitalig – China Cotton 165 GSM.png','main',0,'Quitalig – China Cotton 165 GSM'),(24,59,'/static/pictures/Quitalig – China Cotton 185 GSM.png','main',0,'Quitalig – China Cotton 185 GSM'),(25,60,'/static/pictures/Quitalig – China Cotton 200 GSM.png','main',0,'Quitalig – China Cotton 200 GSM'),(27,62,'/static/pictures/Skylab – CVC Cotton Fabric.jpg','main',0,'Skylab – CVC Cotton Fabric'),(130,83,'/static/pictures/B9117-012-000.jpg','main',0,'Bobbin Case'),(131,84,'/static/pictures/B1837-012-000.jpg','main',0,'Bobbin'),(132,85,'/static/pictures/B1835-012-000.jpg','main',0,'Positioning Finger'),(133,86,'/static/pictures/B1830-127-000.jpg','main',0,'Rotating Hook'),(134,87,'/static/pictures/B3421-552-000.png','main',0,'Presser Foot'),(139,41,'pictures/SHUNFA SF-5550 Single Needle High-Speed Machine (1).jpg','main',1,'SHUNFA SF-5550 Single Needle High-Speed Machine'),(140,41,'pictures/SHUNFA SF-5550 Single Needle High-Speed Machine (2).jpg','main',2,'SHUNFA SF-5550 Single Needle High-Speed Machine');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
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
INSERT INTO `product_specifications` VALUES (39,41,'Brand','Shunfa',0),(40,41,'Model','SF-5550',1),(41,41,'Type','Single Needle High-Speed Lockstitch',2),(42,41,'Speed','5,000 stitches per minute',3),(43,41,'Motor','Servo',4),(44,41,'Needle System','DBX1 (DPx16)',5),(45,41,'Stitch Length','Up to 5mm',6),(46,41,'Presser Foot Lift','6mm',7),(61,42,'Brand','Shunfa',0),(62,42,'Model','SF-562-02BB',1),(63,42,'Type','Overlock Piping Machine',2),(64,42,'Threads','4-thread',3),(65,42,'Stitch Length','Up to 4mm',4),(66,42,'Overedge Width','1.5–6mm',5),(67,42,'Motor','550W',6),(68,43,'Brand','Shunfa',0),(69,43,'Model','SF-372',1),(70,43,'Type','Button Sew Machine',2),(71,43,'Needle System','DBx1 #11',3),(72,43,'Stitch Type','Lockstitch',4),(73,43,'Motor','550W',5),(74,44,'Brand','Shunfa',0),(75,44,'Model','SF-781',1),(76,44,'Type','Buttonholer Machine',2),(77,44,'Stitch Type','Buttonhole Stitch',3),(78,44,'Needle System','DBx1 #11',4),(79,44,'Motor','550W',5),(80,45,'Brand','Shunfa',0),(81,45,'Model','SF-737',1),(82,45,'Type','3-Thread Overlock Machine',2),(83,45,'Threads','3-thread',3),(84,45,'Stitch Length','Up to 4mm',4),(85,45,'Overedge Width','1.5–6mm',5),(86,45,'Motor','550W',6),(94,47,'Brand','Shunfa',0),(95,47,'Model','SF-757',1),(96,47,'Type','5-Thread Overlock Machine',2),(97,47,'Threads','5-thread',3),(98,47,'Stitch Length','Up to 4mm',4),(99,47,'Overedge Width','1.5–6mm',5),(100,47,'Motor','550W',6),(101,48,'Brand','Shunfa',0),(102,48,'Model','JA2-2',1),(103,48,'Type','Household Sewing Machine',2),(104,48,'Needle System','HA x1 #11-#14',3),(105,48,'Stitch Length','6mm',4),(106,48,'Max Sewing Thickness','5mm',5),(107,48,'Presser Foot Height','6mm',6),(108,48,'Dimensions','420 × 200 × 290 mm',7),(109,48,'Weight','11/10 kg',8),(110,48,'Motor','Manual',9),(111,49,'Brand','Shunfa',0),(112,49,'Model','SF-747',1),(113,49,'Type','4-Thread Overlock Machine',2),(114,49,'Threads','4-thread',3),(115,49,'Stitch Length','Up to 4mm',4),(116,49,'Overedge Width','1.5–6mm',5),(117,49,'Motor','550W',6),(118,50,'Brand','Juki',0),(119,50,'Model','DDL-8100E',1),(120,50,'Type','Single Needle High-Speed Lockstitch',2),(121,50,'Speed','4,500 stitches per minute',3),(122,50,'Stitch Length','Up to 5mm',4),(123,50,'Needle System','DB×1 #9–#18',5),(124,50,'Motor','Servo motor',6),(125,50,'Weight','26kg',7),(126,51,'Brand','Juki',0),(127,51,'Model','MO-6700DA Series',1),(128,51,'Type','Overlock / Safety Stitch',2),(129,51,'Speed','7,000 stitches per minute',3),(130,51,'Stitch Length','0.8–4mm',4),(131,51,'Needle System','DC×27',5),(132,51,'Differential Feed Ratio','Gathering 1:2 (max. 1:4), Stretching 1:0.7 (max. 1:0.6)',6),(133,51,'Overedging Width','1.6, 3.2, 4.0, 4.8mm',7),(134,51,'Weight','28kg',8),(135,52,'Brand','Juki',0),(136,52,'Model','W562-02BB',1),(137,52,'Type','Piping Machine',2),(138,52,'Threads','4-thread',3),(139,52,'Stitch Length','Up to 4mm',4),(140,52,'Overedge Width','1.5–6mm',5),(141,52,'Motor','550W',6),(142,53,'Brand','Juki',0),(143,53,'Model','LU-1508N',1),(144,53,'Type','Walking Foot Lockstitch',2),(145,53,'Speed','2,000 stitches per minute',3),(146,53,'Stitch Length','Up to 9mm',4),(147,53,'Needle System','DP×17 #22–#27',5),(148,53,'Motor','Servo motor',6),(149,53,'Weight','70kg',7),(150,54,'Brand','Juki',0),(151,54,'Model','LK-1900S',1),(152,54,'Type','Computer-Controlled Bartacking',2),(153,54,'Speed','3,200 stitches per minute',3),(154,54,'Stitch Length','0.1–10mm',4),(155,54,'Needle System','DP×5 (#14)',5),(156,54,'Motor','Compact AC servo motor',6),(157,54,'Weight','47.1kg',7),(158,55,'Brand','Skylab',0),(159,55,'Fabric Type','Lacoste',1),(160,55,'Composition','Cotton or CVC (Cotton-Poly Blend)',2),(161,55,'Texture','Piqué knit',3),(162,55,'Use','Polo shirts, casual tops',4),(163,55,'Color','White / Black / Navy / pwede mag add pa mas maganda',5),(164,55,'Width','1.2m / 1.5m',6),(165,56,'Brand','Skylab',0),(166,56,'Fabric Type','TR Lacoste',1),(167,56,'Composition','Polyester + Rayon',2),(168,56,'Texture','Piqué knit',3),(169,56,'Use','Uniforms, casual wear',4),(170,56,'Color Options','Red, Navy',5),(171,56,'Width Options','1.2m, 1.5m',6),(172,57,'Brand','Quitalig',0),(173,57,'Fabric Type','Cotton',1),(174,57,'Composition','100% Cotton',2),(175,57,'GSM','135',3),(176,57,'Use','Shirts, linings',4),(177,57,'Color Options','Blue, Red, Black',5),(178,57,'Width Options','1.2m, 1.5m',6),(179,58,'Brand','Quitalig',0),(180,58,'Fabric Type','Cotton',1),(181,58,'Composition','100% Cotton',2),(182,58,'GSM','165',3),(183,58,'Use','T-shirts, uniforms',4),(184,58,'Color Options','Gray, Black, White',5),(185,58,'Width Options','1.2m, 1.5m',6),(186,59,'Brand','Quitalig',0),(187,59,'Fabric Type','Cotton',1),(188,59,'Composition','100% Cotton',2),(189,59,'GSM','185',3),(190,59,'Use','Polo shirts, jackets',4),(191,59,'Color Options','Red, Blue, White',5),(192,59,'Width Options','1.2m, 1.5m',6),(193,60,'Brand','Quitalig',0),(194,60,'Fabric Type','Cotton',1),(195,60,'Composition','100% Cotton',2),(196,60,'GSM','200',3),(197,60,'Use','Workwear, embroidery',4),(198,60,'Color Options','Black, Navy, White',5),(199,60,'Width Options','1.2m, 1.5m',6),(200,61,'Brand','Skylab',0),(201,61,'Fabric Type','TC (Tetron Cotton)',1),(202,61,'Composition','65% Polyester, 35% Cotton',2),(203,61,'GSM','Approx. 150–180',3),(204,61,'Use','Uniforms, shirts',4),(205,61,'Color Options','Red, Blue, Gray',5),(206,61,'Width Options','1.2m, 1.5m',6),(207,62,'Brand','Skylab',0),(208,62,'Fabric Type','CVC',1),(209,62,'Composition','60% Cotton, 40% Polyester',2),(210,62,'GSM','Approx. 160–200',3),(211,62,'Use','T-shirts, uniforms',4),(212,62,'Color Options','Red, Blue, Gray',5),(213,62,'Width Options','1.2m, 1.5m',6),(214,63,'Brand','Skylab',0),(215,63,'Fabric Type','Ribbing',1),(216,63,'Composition','Cotton + Spandex blend',2),(217,63,'Use','Necklines, cuffs, hems',3),(218,63,'Color Options','Black, White, Navy',4),(219,63,'Width Options','1.0m, 1.5m',5),(220,64,'Fabric Type','Charmeuse Silk',0),(221,64,'Composition','100% Mulberry Silk',1),(222,64,'Weight','85 GSM',2),(223,64,'Width','44 inches',3),(224,64,'Use','Evening wear, lingerie, scarves',4),(225,64,'Silk Type Options','Pure Charmeuse Silk, Charmeuse Silk Blend',5),(226,64,'Color Options','Ivory, Champagne, Black',6),(227,64,'Width Options','0.9m, 1.5m',7),(228,65,'Fabric Type','Chiffon Silk',0),(229,65,'Composition','100% Mulberry Silk',1),(230,65,'Weight','29–34 GSM',2),(231,65,'Width','44–54 inches',3),(232,65,'Use','Dresses, blouses, scarves',4),(233,65,'Silk Type Options','Pure Charmeuse Silk, Charmeuse Silk Blend',5),(234,65,'Color Options','Ivory, Champagne, Black',6),(235,65,'Width Options','0.9m, 1.5m',7),(236,66,'Fabric Type','Crepe de Chine Silk',0),(237,66,'Composition','100% Mulberry Silk',1),(238,66,'Weight','45–60 GSM',2),(239,66,'Width','44 inches',3),(240,66,'Use','Blouses, dresses, scarves',4),(241,66,'Silk Type Options','Pure Crepe de Chine Silk, Crepe de Chine Silk Blend',5),(242,66,'Color Options','Champagne, Black, Navy',6),(243,66,'Width Options','0.9m, 1.5m',7),(340,83,'Part Number','B9117-012-000',0),(341,83,'Material','Stainless Steel',1),(342,83,'Compatibility','Compatible with various Shunfa and industrial machines',2),(343,83,'Use','Holds bobbin for smooth thread operation',3),(344,83,'Material Type','Stainless Steel',4),(345,83,'Size','Standard',5),(346,83,'Size','Large',6),(347,84,'Part Number','B1837-012-000',0),(348,84,'Material','Metal or Plastic',1),(349,84,'Compatibility','Compatible with Shunfa and similar industrial machines',2),(350,84,'Use','Stores the bottom thread for consistent stitching',3),(351,84,'Material Type','Metal',4),(352,84,'Size','Small',5),(353,84,'Size','Medium',6),(354,84,'Size','Large',7),(355,85,'Part Number','B1835-012-000',0),(356,85,'Material','Steel',1),(357,85,'Compatibility','Compatible with Shunfa industrial sewing machines',2),(358,85,'Use','Positions fabric for accurate stitching',3),(359,85,'Material','Steel',4),(360,85,'Material','Alloy',5),(361,85,'Size','Standard',6),(362,86,'Part Number','B1830-127-000',0),(363,86,'Material','High-strength steel',1),(364,86,'Compatibility','Shunfa, Juki, and other lockstitch machines',2),(365,86,'Use','Forms stitches by looping thread',3),(366,86,'Material','Steel',4),(367,86,'Material','Alloy',5),(368,87,'Part Number','B3421-552-000',0),(369,87,'Material','Steel or Plastic',1),(370,87,'Compatibility','Shunfa, Juki, and other industrial machines',2),(371,87,'Use','Holds fabric in place for consistent stitching',3),(372,87,'Material','Steel',4),(373,87,'Material','Plastic',5),(374,88,'Part Number','UNO Clutch Motor',0),(375,88,'Power','750W–1000W',1),(376,88,'Speed','2,500–3,000 RPM',2),(377,88,'Compatibility','Compatible with various industrial sewing machines',3),(378,88,'Use','Powers sewing machine for high-speed operation',4),(379,88,'Power','750W',5),(380,88,'Power','1000W',6),(381,88,'Speed Control','Fixed Speed',7),(382,89,'Part Number','UNO Servo Motor',0),(383,89,'Power','Typically 550W',1),(384,89,'Speed Control','Adjustable',2),(385,89,'Compatibility','Fits most industrial sewing machines',3),(386,89,'Use','Powers sewing machine with energy-efficient control',4),(387,89,'Power','550W',5),(388,90,'Part Number','VARIES',0),(389,90,'Material','Steel Frame, Laminate Surface',1),(390,90,'Compatibility','Compatible with Shunfa, Juki, and other industrial machines',2),(391,90,'Use','Supports the sewing machine during operations',3),(392,90,'Table Size','Standard',4),(393,90,'Frame Material','Steel Frame',5),(394,91,'Part Number','DBx1',0),(395,91,'Needle Size','#9 to #18',1),(396,91,'Material','Steel',2),(397,91,'Compatibility','Works with most sewing machines',3),(398,91,'Use','General-purpose needle for various fabrics',4),(399,91,'Needle Size','#9',5),(400,91,'Needle Size','#10',6),(401,91,'Needle Size','#12',7),(402,91,'Needle Size','#14',8),(403,91,'Needle Size','#16',9),(404,91,'Needle Size','#18',10),(405,91,'Material','Steel',11),(406,91,'Material','Titanium Coated',12),(407,92,'Part Number','DBxK',0),(408,92,'Needle Size','#11 to #16',1),(409,92,'Material','Steel with Ballpoint tip',2),(410,92,'Compatibility','Compatible with most industrial machines',3),(411,92,'Use','For knit fabrics, jerseys, and stretch fabrics',4),(412,92,'Needle Size','#11',5),(413,92,'Needle Size','#14',6),(414,92,'Needle Size','#16',7),(415,92,'Material','Steel',8),(416,92,'Material','Titanium Coated',9),(417,93,'Part Number','DBx1-JEANS',0),(418,93,'Needle Size','#16 to #18',1),(419,93,'Material','Steel with reinforced shaft',2),(420,93,'Compatibility','Works with most sewing machines',3),(421,93,'Use','For heavy fabrics such as denim, canvas, and thick upholstery materials',4),(422,93,'Needle Size','#16',5),(423,93,'Needle Size','#18',6),(424,93,'Material','Steel',7),(425,93,'Material','Titanium Coated',8),(426,94,'Part Number','DBx1-Microtex',0),(427,94,'Needle Size','#9 to #11',1),(428,94,'Material','Steel with a slim, tapered point',2),(429,94,'Compatibility','Compatible with most industrial and domestic sewing machines',3),(430,94,'Use','For fine fabrics like silk, satin, and microfibers',4),(431,94,'Needle Size','#9',5),(432,94,'Needle Size','#10',6),(433,94,'Needle Size','#11',7),(434,94,'Material','Steel',8),(435,94,'Material','Titanium Coated',9);
/*!40000 ALTER TABLE `product_specifications` ENABLE KEYS */;
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
  `discount_percentage` decimal(5,2) DEFAULT NULL,
  `stock_quantity` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `subcategory` text,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `unique_product_name_model` (`product_name`,`model_number`),
  KEY `category_id` (`category_id`),
  KEY `brand_id` (`brand_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (41,'SHUNFA SF-5550 Single Needle High-Speed Machine','SF-5550','Shunfa\'s SF-5550 is a high-speed, single needle lockstitch industrial sewing machine. It\'s ideal for garment factories, providing consistent and accurate stitching for various fabric types.',1,8450.75,0.00,50,'2025-05-16 08:23:38','2025-05-16 08:23:38',1,NULL),(42,'SHUNFA SF-562-02BB – Piping Machine','SF-562-02BB','Shunfa SF-562-02BB is a specialized overlock machine equipped with a piping foot, suitable for sewing decorative or functional piping into garment seams.',4,8999.99,0.00,10,'2025-05-16 08:31:51','2025-05-16 08:58:27',1,NULL),(43,'SHUNFA SF-372 – Button Sew Machine','SF-372','Shunfa SF-372 is designed for button attachment on shirts, jackets, and other garments, providing secure stitching with adjustable settings.',1,10999.00,0.00,10,'2025-05-16 09:25:46','2025-05-16 09:27:39',1,NULL),(44,'SHUNFA SF-781 – Buttonholer Machine','SF-781','Shunfa SF-781 is an industrial buttonholer ideal for producing precise, consistent buttonholes across light to medium fabrics.',1,10999.00,0.00,10,'2025-05-16 09:32:40','2025-05-16 09:32:40',1,NULL),(45,'SHUNFA SF-737 – 3-Thread Overlock Machine','SF-737','Shunfa SF-737 is a 3-thread overlock machine used for edge finishing and light seaming in knitted and woven fabrics.',1,10999.00,0.00,9,'2025-05-16 09:38:58','2025-05-17 07:34:41',1,NULL),(47,'SHUNFA SF-757 – 5-Thread Overlock Machine','SF-757','Shunfa SF-757 combines overlock and safety stitching in one operation, ideal for trousers, jeans, and heavy-duty garments.',1,10999.00,0.00,10,'2025-05-16 09:39:25','2025-05-16 09:39:25',1,NULL),(48,'SHUNFA JA2-2 – Household Sewing Machine','JA2-2','Shunfa JA2-2 is a durable household sewing machine designed for home use or small-scale tailoring, offering manual control and stable performance.',1,10999.00,0.00,10,'2025-05-16 09:39:49','2025-05-16 09:39:49',1,NULL),(49,'SHUNFA SF-747 – 4-Thread Overlock Machine','SF-747','Shunfa SF-747 is a 4-thread overlock machine that balances seam strength and flexibility, suitable for most garment construction.',1,10999.00,0.00,10,'2025-05-16 09:47:38','2025-05-16 09:47:38',1,NULL),(50,'Juki DDL-8100E – Single Needle High-Speed Lockstitch Machine','DDL-8100E','The Juki DDL-8100E is a high-speed, single-needle lockstitch sewing machine designed for industrial applications. It offers precise stitching and is suitable for light to medium-weight fabrics.',1,10898.00,0.00,10,'2025-05-16 10:02:14','2025-05-16 10:06:29',2,NULL),(51,'Juki MO-6700DA Series – Semi-Dry Head Overlock Machine','MO-6700DA Series','The Juki MO-6700DA Series is a high-speed overlock machine featuring semi-dry head technology, which reduces oil stains on sewing products. It is suitable for various fabrics and offers enhanced durability.',1,8998.00,0.00,10,'2025-05-16 10:02:14','2025-05-16 10:06:29',2,NULL),(52,'Juki W562-02BB – Piping Machine','W562-02BB','The Juki W562-02BB is a specialized piping machine designed for sewing piping into seams, commonly used in garment manufacturing for decorative or functional purposes.',1,10998.00,0.00,10,'2025-05-16 10:02:14','2025-05-16 10:06:29',2,NULL),(53,'Juki LU-1508N – Walking Foot Lockstitch Machine','LU-1508N','The Juki LU-1508N is a walking foot lockstitch sewing machine designed for heavy-duty applications, providing consistent stitching on thick and multi-layered materials.',1,12998.00,0.00,10,'2025-05-16 10:02:15','2025-05-16 10:06:29',2,NULL),(54,'Juki LK-1900S – Computer-Controlled Bartacking Machine','LK-1900S','The Juki LK-1900S is a computer-controlled bartacking machine designed for high-speed and high-quality bartack stitching, suitable for various garment applications.',1,11998.00,0.00,10,'2025-05-16 10:02:15','2025-05-16 10:06:29',2,NULL),(55,'Skylab – Lacoste Fabric','Lacoste','Locally manufactured Lacoste fabric from Skylab, ideal for polo shirts and casual wear. Features a textured knit with excellent breathability and stretch.\n\nFor bulk orders, kindly send us a private message for further assistance.',3,499.00,0.00,100,'2025-05-16 10:25:08','2025-05-16 10:34:22',3,NULL),(56,'Skylab – TR Lacoste Fabric','TR Lacoste','TR Lacoste fabric blends polyester and rayon, offering a durable and wrinkle-resistant material with a soft feel, commonly used for uniforms and corporate wear. For bulk orders, kindly send us a private message for further assistance.',3,599.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',3,NULL),(57,'Quitalig – China Cotton 135 GSM','Cotton','Lightweight 100% cotton fabric suitable for warm climates, shirts, linings, or layering. For bulk orders, kindly send us a private message for further assistance.',3,499.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',4,NULL),(58,'Quitalig – China Cotton 165 GSM','Cotton','Midweight cotton fabric ideal for general garments like t-shirts, dresses, and uniforms. For bulk orders, kindly send us a private message for further assistance.',3,499.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',4,NULL),(59,'Quitalig – China Cotton 185 GSM','Cotton','Heavier cotton fabric for durable garments like workwear or outerwear with a soft, breathable feel. For bulk orders, kindly send us a private message for further assistance.',3,499.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',4,NULL),(60,'Quitalig – China Cotton 200 GSM','Cotton','High-density cotton for structured clothing and durable garments. Excellent for embroidery. For bulk orders, kindly send us a private message for further assistance.',3,499.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',4,NULL),(61,'Skylab – TC Fabric','TC (Tetron Cotton)','TC (Tetron Cotton) fabric combines polyester with cotton for strength, easy care, and wrinkle resistance. Common in uniforms and casual apparel. For bulk orders, kindly send us a private message for further assistance.',3,599.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',3,NULL),(62,'Skylab – CVC Cotton Fabric','CVC','CVC (Chief Value Cotton) fabric has higher cotton content for comfort with added durability and lower shrinkage, perfect for everyday garments. For bulk orders, kindly send us a private message for further assistance.',3,599.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',3,NULL),(63,'Skylab – Ribbings for Neckline','Ribbing','Stretchable ribbing fabric used in collars, cuffs, and hems to enhance flexibility and fit. For bulk orders, kindly send us a private message for further assistance.',3,599.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',3,NULL),(64,'Charmeuse Silk','Charmeuse Silk','Charmeuse is a luxurious silk fabric known for its high-gloss finish and smooth texture. It is lightweight and drapes beautifully, making it ideal for elegant evening wear, lingerie, and scarves. For bulk orders, kindly send us a private message for further assistance.',29,1499.00,0.00,100,'2025-05-16 10:37:59','2025-05-16 10:37:59',NULL,NULL),(65,'Chiffon Silk','Chiffon Silk','Chiffon silk is a lightweight, sheer fabric with a soft, flowing drape. It is often used in layering garments such as dresses, blouses, and scarves, providing an airy and romantic aesthetic. For bulk orders, kindly send us a private message for further assistance.',29,1499.00,0.00,100,'2025-05-16 10:38:00','2025-05-16 10:38:00',NULL,NULL),(66,'Crepe de Chine Silk','Crepe de Chine Silk','Crepe de Chine is a lightweight silk fabric with a soft, crinkled texture. It offers a subtle sheen and is commonly used for blouses, dresses, and scarves, providing an elegant and refined appearance. For bulk orders, kindly send us a private message for further assistance.',29,1499.00,0.00,100,'2025-05-16 10:38:00','2025-05-16 10:38:00',NULL,NULL),(67,'Sample Cotton Fabric','SAMPLE-001','This is a sample product for Cotton Fabric.',30,100.00,NULL,10,NULL,NULL,NULL,NULL),(68,'Sample Polyester-Blend Fabrics','SAMPLE-001','This is a sample product for Polyester-Blend Fabrics.',31,100.00,NULL,10,NULL,NULL,NULL,NULL),(69,'Sample Knitted Fabrics','SAMPLE-001','This is a sample product for Knitted Fabrics.',32,100.00,NULL,10,NULL,NULL,NULL,NULL),(70,'Sample Woven Fabrics','SAMPLE-001','This is a sample product for Woven Fabrics.',33,100.00,NULL,10,NULL,NULL,NULL,NULL),(83,'Bobbin Case','B9117-012-000','The bobbin case holds the bobbin in place and ensures smooth thread flow to form stitches. For bulk orders, kindly send us a private message for further assistance.',2,120.00,NULL,50,NULL,NULL,NULL,'SewingMachineComponents'),(84,'Bobbin','B1837-012-000','The bobbin stores the bottom thread, which works in tandem with the needle thread to form stitches. For bulk orders, kindly send us a private message for further assistance.',2,15.00,NULL,100,NULL,NULL,NULL,'SewingMachineComponents'),(85,'Positioning Finger','B1835-012-000','The positioning finger guides the fabric through the machine to ensure alignment and prevent slippage during high-speed sewing. For bulk orders, kindly send us a private message for further assistance.',2,60.00,NULL,100,NULL,NULL,NULL,'SewingMachineComponents'),(86,'Rotating Hook','B1830-127-000','The rotating hook picks up the top thread and loops it around the bobbin thread to create stitches. For bulk orders, kindly send us a private message for further assistance.',2,350.00,NULL,50,NULL,NULL,NULL,NULL),(87,'Presser Foot','B3421-552-000','The presser foot holds fabric in place while stitching and applies pressure to ensure even feeding of fabric. For bulk orders, kindly send us a private message for further assistance.',2,40.00,NULL,100,NULL,NULL,NULL,NULL),(88,'Clutch Motor for Sewing Machine','UNO Clutch Motor','The clutch motor provides the power to drive the sewing machine, essential for high-speed industrial sewing. For bulk orders, kindly send us a private message for further assistance.',2,2200.00,NULL,20,NULL,NULL,NULL,NULL),(89,'Servo Motor for Sewing Machine','UNO Servo Motor','Servo motors offer precise speed control and are energy-efficient, providing smooth operation and reducing energy consumption. For bulk orders, kindly send us a private message for further assistance.',2,2500.00,NULL,20,NULL,NULL,NULL,NULL),(90,'Table and Stand for Industrial Sewing Machine','VARIES','A sturdy table and stand that supports industrial sewing machines, designed for stability during high-speed sewing. For bulk orders, kindly send us a private message for further assistance.',2,3500.00,NULL,10,NULL,NULL,NULL,NULL),(91,'Universal Needles','DBx1','Universal needles are suitable for most types of fabrics, offering reliable stitching for general purposes. For bulk orders, kindly send us a private message for further assistance.',2,10.00,NULL,200,NULL,NULL,NULL,NULL),(92,'Ballpoint Needles','DBxK','Ballpoint needles are designed for sewing knit fabrics, preventing snags and providing smooth stitching on stretchy materials. For bulk orders, kindly send us a private message for further assistance.',2,12.00,NULL,200,NULL,NULL,NULL,NULL),(93,'Jeans Needles','DBx1-JEANS','Jeans needles have a strong shaft and a thick, strong needle point designed specifically for sewing through heavy fabrics like denim and canvas without breaking. For bulk orders, kindly send us a private message for further assistance.',2,15.00,NULL,200,NULL,NULL,NULL,NULL),(94,'Microtex Needles','DBx1-Microtex','Microtex needles have a very slim, sharp point designed to handle fine fabrics such as silk, tulle, or microfiber without damaging them. For bulk orders, kindly send us a private message for further assistance.',2,18.00,NULL,200,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text NOT NULL,
  `media_url` varchar(255) DEFAULT NULL,
  `media_type` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supply_requests`
--

DROP TABLE IF EXISTS `supply_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supply_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `staff_id` int NOT NULL,
  `quantity_requested` int NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `notes` text,
  `request_date` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `idx_supply_request_staff` (`staff_id`),
  KEY `idx_supply_request_status` (`status`),
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
  `role` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `is_google_user` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'john jerriehlpontino','johnjerriehlp@gmail.com','scrypt:32768:8:1$lMYRXQATix7as5yp$fdf5093b578c36f302c6fbe019bf4527007182fba442ea6ef9289685fc5a734b72f661f27b98082297592a1a12184f5b36610ca34a2136b7f343ba970ff49c9e','user','2025-05-11 12:55:05','2025-05-15 06:25:39',1,'John Jerriehl','Pontino','male','2005-06-20','https://lh3.googleusercontent.com/a/ACg8ocLHymdwl2aLTBYIx0cFQVr2fTTxaMEWIjkssrjRoJxDHnDeJxfW=s96-c','09317649032',0),(2,'pontino.johnjerriehl.00246','pontino.johnjerriehl.00246@dyci.edu.ph',NULL,'user','2025-05-13 16:32:57',NULL,1,'rie','JERRIEHL PONTINO','male','1931-06-11','https://lh3.googleusercontent.com/a/ACg8ocJCW0oZOAkBoQKt5OJ18hEmLFlJBU8euuM_nJ1TfxIYQp7pPpE=s96-c','09942436659',1),(3,'banrizyon','ignacioken397@gmail.com','scrypt:32768:8:1$eOMwwNTPe9kKhh7g$9434ce1dc32c5b1f3f06aaa4c5d771aa4a1406e4f930e39c6674a111196f9bf2d02115ea89382f2dc16c442973470e1a250230b5756b85cdefccadafb8a97982','user','2025-05-14 05:13:01','2025-05-14 05:13:10',1,'Banri','Zyon','male','2005-06-20','3_1747170845.jpg','09317649032',0),(4,'hershelle gemmabutol','Hershellegemmabutol1@gmail.com','scrypt:32768:8:1$GBo51rgGhHcZXk3v$2ef408b14d698d4e5bf42144b4f9420135ff15cd39285a63bf104a3241babc9416c14de50854baadf35b1bf8340b07be8c22d3720ca0daadf487cb7b2ffa5418','user','2025-05-14 10:43:50','2025-05-14 10:44:04',1,'Hershelle Gem','Mabutol',NULL,NULL,'static/defaultprofile.jpg',NULL,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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

--
-- Adding useful indexes to existing tables
--

ALTER TABLE `products` ADD INDEX `idx_product_price` (`base_price`);
ALTER TABLE `products` ADD INDEX `idx_product_stock` (`stock_quantity`);
ALTER TABLE `orders` ADD INDEX `idx_order_status` (`status`);
ALTER TABLE `orders` ADD INDEX `idx_order_date` (`created_at`);
ALTER TABLE `users` ADD INDEX `idx_user_role` (`role`);

--
-- Inserting sample data for new tables
--

LOCK TABLES `product_promotions` WRITE;
/*!40000 ALTER TABLE `product_promotions` DISABLE KEYS */;
INSERT INTO `product_promotions` VALUES 
(1, 41, 'Summer Sale', 15.00, '2025-06-01 00:00:00', '2025-06-30 23:59:59', 1, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(2, 55, 'Fabric Discount', 10.00, '2025-05-20 00:00:00', '2025-05-25 23:59:59', 1, '2025-05-18 14:00:00', '2025-05-18 14:00:00');
/*!40000 ALTER TABLE `product_promotions` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES 
(1, 55, 'Color', 'Red', 0.00, 50, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(2, 55, 'Color', 'Blue', 0.00, 50, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(3, 55, 'Size', '1.2m', 0.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00'),
(4, 55, 'Size', '1.5m', 50.00, 25, '2025-05-18 14:00:00', '2025-05-18 14:00:00');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

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
