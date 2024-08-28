/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 80028
Source Host           : localhost:3306
Source Database       : mydb

Target Server Type    : MYSQL
Target Server Version : 80028
File Encoding         : 65001

Date: 2024-08-27 11:20:52
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for account
-- ----------------------------
DROP TABLE IF EXISTS `account`;
CREATE TABLE `account` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `account` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `role` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of account
-- ----------------------------

-- ----------------------------
-- Table structure for charger
-- ----------------------------
DROP TABLE IF EXISTS `charger`;
CREATE TABLE `charger` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `station_id` bigint NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` int DEFAULT '0',
  `max_power` float(20,0) DEFAULT '0',
  `connector_type` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of charger
-- ----------------------------
INSERT INTO `charger` VALUES ('1', '101', 'Charger A', 'Location A', '2', '150', '1');

-- ----------------------------
-- Table structure for maintenance_history
-- ----------------------------
DROP TABLE IF EXISTS `maintenance_history`;
CREATE TABLE `maintenance_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `date` date NOT NULL,
  `description` varchar(0) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `maintenance_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of maintenance_history
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `registration_number` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `battery_level` float DEFAULT '0',
  `current_location` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` int DEFAULT '0',
  `vehicle_damage` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_update` date NOT NULL,
  `model` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `manufacturer` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_number` (`registration_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
