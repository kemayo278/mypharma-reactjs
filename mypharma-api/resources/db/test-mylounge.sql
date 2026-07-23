-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 28 sep. 2024 à 09:24
-- Version du serveur : 8.0.31
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `test-mylounge`
--

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'BIERES', 'x', '2024-06-14 14:01:23', '2024-07-11 16:11:11'),
(3, 'CUISINE', 'x', '2024-07-11 12:25:32', '2024-07-11 16:11:01');

-- --------------------------------------------------------

--
-- Structure de la table `configs`
--

DROP TABLE IF EXISTS `configs`;
CREATE TABLE IF NOT EXISTS `configs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `begin` date NOT NULL,
  `end` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `configs`
--

INSERT INTO `configs` (`id`, `begin`, `end`, `created_at`, `updated_at`) VALUES
(1, '2024-09-05', '2024-09-22', NULL, '2024-09-06 08:50:38');

-- --------------------------------------------------------

--
-- Structure de la table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `customers`
--

INSERT INTO `customers` (`id`, `name`, `created_at`, `updated_at`, `city`, `address`, `phone`) VALUES
(6, 'client Divers', '2024-07-11 04:13:44', '2024-07-11 04:13:44', 'Douala', 'Douala', '699989888');

-- --------------------------------------------------------

--
-- Structure de la table `entries`
--

DROP TABLE IF EXISTS `entries`;
CREATE TABLE IF NOT EXISTS `entries` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `provider_id` bigint UNSIGNED NOT NULL,
  `date_entry` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `entries_user_id_foreign` (`user_id`),
  KEY `entries_provider_id_foreign` (`provider_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `entry_products`
--

DROP TABLE IF EXISTS `entry_products`;
CREATE TABLE IF NOT EXISTS `entry_products` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` bigint UNSIGNED NOT NULL,
  `entry_id` bigint UNSIGNED NOT NULL,
  `quantity` int NOT NULL,
  `entry_purchase_price` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `entry_products_product_id_foreign` (`product_id`),
  KEY `entry_products_entry_id_foreign` (`entry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `false_sales`
--

DROP TABLE IF EXISTS `false_sales`;
CREATE TABLE IF NOT EXISTS `false_sales` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `quantity` int NOT NULL,
  `sell_price` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `false_sales_order_id_foreign` (`order_id`),
  KEY `false_sales_product_id_foreign` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `false_sales`
--

INSERT INTO `false_sales` (`id`, `order_id`, `product_id`, `quantity`, `sell_price`, `created_at`, `updated_at`) VALUES
(31, 22, 62, 3, 4000, '2024-09-10 14:04:48', '2024-09-10 14:04:48'),
(32, 23, 63, 1, 2000, '2024-09-11 08:00:27', '2024-09-11 08:00:27'),
(33, 24, 62, 1, 4000, '2024-09-11 08:36:50', '2024-09-11 08:36:50'),
(34, 25, 63, 2, 2000, '2024-09-11 08:40:25', '2024-09-11 08:40:25'),
(35, 26, 62, 1, 4000, '2024-09-11 08:42:52', '2024-09-11 08:42:52'),
(36, 27, 62, 1, 4000, '2024-09-16 09:22:18', '2024-09-16 09:22:18'),
(37, 28, 62, 1, 4000, '2024-09-19 09:48:30', '2024-09-19 09:48:30'),
(38, 29, 64, 2, 1500, '2024-09-23 13:35:04', '2024-09-23 13:35:04'),
(39, 30, 63, 1, 2000, '2024-09-23 14:23:48', '2024-09-23 14:23:48'),
(40, 30, 64, 1, 1500, '2024-09-23 14:23:48', '2024-09-23 14:23:48'),
(41, 30, 62, 1, 4000, '2024-09-23 14:23:48', '2024-09-23 14:23:48'),
(42, 31, 63, 1, 2000, '2024-09-23 14:26:11', '2024-09-23 14:26:11'),
(43, 32, 63, 1, 2000, '2024-09-23 15:42:53', '2024-09-23 15:42:53'),
(44, 33, 62, 2, 4000, '2024-09-23 15:43:29', '2024-09-23 15:43:29'),
(45, 34, 65, 1, 1000, '2024-09-25 13:55:32', '2024-09-25 13:55:32'),
(46, 35, 62, 2, 4000, '2024-09-26 07:54:35', '2024-09-26 07:54:35'),
(47, 36, 64, 1, 1500, '2024-09-26 07:59:27', '2024-09-26 07:59:27'),
(48, 36, 63, 1, 2000, '2024-09-26 07:59:27', '2024-09-26 07:59:27'),
(49, 36, 65, 1, 1000, '2024-09-26 07:59:28', '2024-09-26 07:59:28'),
(50, 36, 62, 1, 4000, '2024-09-26 07:59:28', '2024-09-26 07:59:28'),
(51, 37, 64, 1, 1500, '2024-09-26 10:02:21', '2024-09-26 10:02:21'),
(52, 37, 65, 1, 1000, '2024-09-26 10:02:22', '2024-09-26 10:02:22'),
(53, 38, 62, 2, 4000, '2024-09-27 08:06:59', '2024-09-27 08:06:59'),
(54, 38, 63, 2, 2000, '2024-09-27 08:07:00', '2024-09-27 08:07:00'),
(55, 39, 65, 1, 1000, '2024-09-27 09:58:38', '2024-09-27 09:58:38'),
(56, 40, 64, 1, 1500, '2024-09-27 10:21:30', '2024-09-27 10:21:30'),
(57, 41, 64, 1, 1500, '2024-09-27 12:45:18', '2024-09-27 12:45:18'),
(58, 41, 63, 2, 2000, '2024-09-27 12:45:18', '2024-09-27 12:45:18'),
(59, 42, 64, 1, 1500, '2024-09-27 12:45:45', '2024-09-27 12:45:45'),
(60, 42, 63, 1, 2000, '2024-09-27 12:45:46', '2024-09-27 12:45:46'),
(61, 43, 62, 1, 4000, '2024-09-27 13:31:13', '2024-09-27 13:31:13'),
(62, 43, 64, 1, 1500, '2024-09-27 13:31:14', '2024-09-27 13:31:14'),
(63, 43, 63, 1, 2000, '2024-09-27 13:31:14', '2024-09-27 13:31:14');

-- --------------------------------------------------------

--
-- Structure de la table `institutions`
--

DROP TABLE IF EXISTS `institutions`;
CREATE TABLE IF NOT EXISTS `institutions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `matriculation` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pj` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `number_register` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pj_register` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `num_declaration` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cycle` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `couverture` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `institutions`
--

INSERT INTO `institutions` (`id`, `name`, `state`, `matriculation`, `phone`, `pj`, `number_register`, `pj_register`, `num_declaration`, `img`, `cycle`, `telephone`, `couverture`, `created_at`, `updated_at`) VALUES
(1, 'My Lounge', 'Lounge', '', '1234', '', '', '', '', 'IMG-2024-09-05_17-15-32-1725552932055.png', '', '', '', '2024-09-05 15:15:32', '2024-09-11 12:13:55');

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_roles_table', 1),
(2, '2014_10_12_000001_create_users_table', 1),
(3, '2014_10_12_100000_create_password_resets_table', 1),
(4, '2019_08_19_000000_create_failed_jobs_table', 1),
(5, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(6, '2024_05_07_080233_create_categories_table', 1),
(7, '2024_05_07_081236_create_configs_table', 1),
(8, '2024_05_07_081419_create_customers_table', 1),
(9, '2024_05_07_081504_create_products_table', 1),
(10, '2024_05_07_081611_create_institutions_table', 1),
(11, '2024_05_07_081657_create_orders_table', 1),
(12, '2024_05_07_081752_create_entries_table', 1),
(13, '2024_05_07_081900_create_sales_table', 1),
(14, '2024_05_07_104250_create_providers_table', 2),
(15, '2024_05_23_081752_create_entries_table', 2),
(16, '2024_05_23_105009_create_entry_products_table', 2),
(17, '2024_06_14_155235_add_degree_to_users', 2),
(18, '2024_06_14_162528_add_reference_to_products', 3),
(19, '2024_06_14_162814_add_fields_to_customers', 4),
(20, '2024_07_08_220823_add_pseudo_to_users', 5),
(21, '2024_07_10_155352_create_false_sales_table', 6);

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `date_order` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `titled` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `customer_id` bigint UNSIGNED NOT NULL,
  `price` double NOT NULL,
  `state` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_user_id_foreign` (`user_id`),
  KEY `orders_customer_id_foreign` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `date_order`, `reference`, `titled`, `user_id`, `customer_id`, `price`, `state`, `created_at`, `updated_at`) VALUES
(22, '20240910', 'CMD202409101604471', 'Table x', 51, 6, 12000, 'paid', '2024-09-10 14:04:47', '2024-09-11 06:58:17'),
(23, '20240911', 'CMD202409111000272', 'Table x', 51, 6, 2000, 'paid', '2024-09-11 08:00:27', '2024-09-23 14:20:55'),
(24, '20240911', 'CMD202409111036503', 'Ym', 51, 6, 4000, 'paid', '2024-09-11 08:36:50', '2024-09-23 14:31:14'),
(25, '20240911', 'CMD202409111040254', 'Xx', 51, 6, 4000, 'unpaid and destocked', '2024-09-11 08:40:25', '2024-09-11 08:40:30'),
(26, '20240911', 'CMD202409111042525', 'Boss', 51, 6, 4000, 'debt', '2024-09-11 08:42:52', '2024-09-16 14:22:36'),
(27, '20240916', 'CMD202409161122186', 'Test', 51, 6, 4000, 'paid', '2024-09-16 09:22:18', '2024-09-23 14:30:33'),
(28, '20240919', 'CMD202409191148307', '344', 65, 6, 4000, 'paid', '2024-09-19 09:48:30', '2024-09-23 13:47:47'),
(29, '20240923', 'CMD202409231535038', 'Boss', 51, 6, 3000, 'paid', '2024-09-23 13:35:03', '2024-09-23 13:39:13'),
(30, '20240923', 'CMD202409231623489', 'Mr keta', 51, 6, 7500, 'debt', '2024-09-23 14:23:48', '2024-09-23 14:25:43'),
(31, '20240923', 'CMD2024092316261110', 'Xz', 51, 6, 2000, 'paid', '2024-09-23 14:26:11', '2024-09-23 14:35:40'),
(32, '20240923', 'CMD2024092317425311', 'Xxxxxx', 51, 6, 2000, 'unpaid and not cleared', '2024-09-23 15:42:53', '2024-09-23 15:42:53'),
(33, '20240923', 'CMD2024092317432912', 'Jules', 51, 6, 8000, 'unpaid and not cleared', '2024-09-23 15:43:29', '2024-09-23 15:43:29'),
(34, '20240925', 'CMD2024092515553213', 'Salon 1', 51, 6, 1000, 'paid OM', '2024-09-25 13:55:32', '2024-09-25 14:22:31'),
(35, '20240926', 'CMD2024092609543514', 'Xx', 51, 6, 8000, 'unpaid and destocked', '2024-09-26 07:54:35', '2024-09-26 07:55:07'),
(36, '20240926', 'CMD2024092609592715', 'Zt', 51, 6, 8500, 'unpaid and not cleared', '2024-09-26 07:59:27', '2024-09-26 07:59:27'),
(37, '20240926', 'CMD2024092612022116', 'Ww', 51, 6, 2500, 'unpaid and not cleared', '2024-09-26 10:02:21', '2024-09-26 10:02:21'),
(38, '20240927', 'CMD2024092710065917', 'table de pablo', 65, 6, 12000, 'unpaid and destocked', '2024-09-27 08:06:59', '2024-09-27 08:28:52'),
(39, '20240927', 'CMD2024092711583718', 'Jp', 51, 6, 1000, 'unpaid and not cleared', '2024-09-27 09:58:37', '2024-09-27 09:58:37'),
(40, '20240927', 'CMD2024092712213019', 'Padre', 51, 6, 1500, 'unpaid and not cleared', '2024-09-27 10:21:30', '2024-09-27 10:21:30'),
(41, '20240927', 'CMD2024092714451720', 'Recap', 51, 6, 5500, 'unpaid and not cleared', '2024-09-27 12:45:17', '2024-09-27 12:45:17'),
(42, '20240927', 'CMD2024092714454521', 'Recap', 51, 6, 3500, 'unpaid and not cleared', '2024-09-27 12:45:45', '2024-09-27 12:45:45'),
(43, '20240927', 'CMD2024092715311322', 'test', 65, 6, 7500, 'unpaid and not cleared', '2024-09-27 13:31:13', '2024-09-27 13:31:13');

-- --------------------------------------------------------

--
-- Structure de la table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE IF NOT EXISTS `password_resets` (
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `password_resets_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=651 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 51, 'main', '3884e142292ee1e7360eb6df4488afda7c0055ac910085d2c052f6a95e1f1bed', '[\"*\"]', NULL, '2024-06-14 13:49:04', '2024-06-14 13:49:04'),
(2, 'App\\Models\\User', 61, 'main', 'c8e4f113b6f778cf22d4fc70ada51f4d5de75cadf6f660e93f2b75589b3e76f1', '[\"*\"]', NULL, '2024-06-14 13:58:40', '2024-06-14 13:58:40'),
(3, 'App\\Models\\User', 51, 'main', '9f079b85f4965ab3cf082687ebf429b550dd458b43805f560526953b5667da77', '[\"*\"]', NULL, '2024-06-14 13:59:17', '2024-06-14 13:59:17'),
(4, 'App\\Models\\User', 61, 'main', 'e48d992cb2ed29d6018f7126d4b032a3f02fdbc7d075ecc6534e21ef23f349d5', '[\"*\"]', NULL, '2024-06-14 14:00:20', '2024-06-14 14:00:20'),
(5, 'App\\Models\\User', 51, 'main', 'c636081d77af72541a1ec5bb06e618d914d41a983762bd03657a2a6aaa63063d', '[\"*\"]', NULL, '2024-06-14 14:06:06', '2024-06-14 14:06:06'),
(6, 'App\\Models\\User', 51, 'main', '0a2d13574641a940f5c54bfdeb8684364999451e13ffbfb93a276958244b06f7', '[\"*\"]', NULL, '2024-06-15 08:02:03', '2024-06-15 08:02:03'),
(7, 'App\\Models\\User', 51, 'main', 'bfcf2aecd73da3fd40b60a7cb5d8d0e8c36ec1ec986e4b965e29f2bfa296a97c', '[\"*\"]', NULL, '2024-06-15 08:04:35', '2024-06-15 08:04:35'),
(8, 'App\\Models\\User', 51, 'main', '5181b08636e67dd8d385faf08b7b185bf6fdee8b54a0541a2c5ad68d27813973', '[\"*\"]', NULL, '2024-06-15 08:05:55', '2024-06-15 08:05:55'),
(9, 'App\\Models\\User', 51, 'main', '8a0c8af7680d0b14008a03b25ea323aa943a28c8d263f3a991b65cee99ca10cb', '[\"*\"]', NULL, '2024-06-15 08:17:43', '2024-06-15 08:17:43'),
(10, 'App\\Models\\User', 51, 'main', '658d1dc7750692af5ed2619e08b11618a7f10c14e5951996d2913120d6ac9c2c', '[\"*\"]', NULL, '2024-06-15 08:19:30', '2024-06-15 08:19:30'),
(11, 'App\\Models\\User', 51, 'main', '75abaabbee6075e69b2e1cad30582d286b946add61c40d6193f7c39cb1c48f62', '[\"*\"]', NULL, '2024-06-15 08:36:56', '2024-06-15 08:36:56'),
(12, 'App\\Models\\User', 51, 'main', 'bb8f6f13a0a86a6196780d502f27afe6d5d1384c009f23bbc6aa8210d2eafcbe', '[\"*\"]', NULL, '2024-06-15 08:50:15', '2024-06-15 08:50:15'),
(13, 'App\\Models\\User', 51, 'main', '71cd18184d34b4a0ad07bd3f3b47e428cc8b4c13371ade4fe62a8319fb776e57', '[\"*\"]', NULL, '2024-06-15 08:53:01', '2024-06-15 08:53:01'),
(14, 'App\\Models\\User', 51, 'main', 'e362480674ccabfb513e63af95597cb1ee30a2b1b0ba8cd97b064efc81b2cdbb', '[\"*\"]', NULL, '2024-06-15 09:18:31', '2024-06-15 09:18:31'),
(15, 'App\\Models\\User', 51, 'main', '9abef94af44f7e55e18cecc2c3d624566c05bf47552852d20d51f5842c37be2b', '[\"*\"]', NULL, '2024-06-15 09:23:27', '2024-06-15 09:23:27'),
(16, 'App\\Models\\User', 51, 'main', 'abba5b05721fafea1a3ded7e1e8f2c0844c88c505862c76b077ef112f3cab16b', '[\"*\"]', NULL, '2024-06-15 09:27:19', '2024-06-15 09:27:19'),
(17, 'App\\Models\\User', 51, 'main', 'd2eae18285acd6759fa9bb79f5a804f08953d313704fd61b6ade4780170c8f72', '[\"*\"]', NULL, '2024-06-15 09:35:51', '2024-06-15 09:35:51'),
(18, 'App\\Models\\User', 51, 'main', 'e0ccc93d729230f5ed2ece65a9e6be71754d9000f39d103640b8033d858f6765', '[\"*\"]', NULL, '2024-06-15 09:39:55', '2024-06-15 09:39:55'),
(19, 'App\\Models\\User', 51, 'main', '8a5277f7a328e1dcd8761a566405a7b704d307d9df25d08041b4cd2aab932947', '[\"*\"]', NULL, '2024-06-15 10:13:34', '2024-06-15 10:13:34'),
(20, 'App\\Models\\User', 51, 'main', '7dd6d3f3405c673897b780eb530a815eeeae73f4543eb027968cc3d0b04fb0f0', '[\"*\"]', NULL, '2024-06-15 10:16:34', '2024-06-15 10:16:34'),
(21, 'App\\Models\\User', 51, 'main', '6f624ecdc341c1578c02850fbff33a9d4e1a88c24de7f8545f48930b6ad0b3ec', '[\"*\"]', NULL, '2024-06-15 10:48:56', '2024-06-15 10:48:56'),
(22, 'App\\Models\\User', 51, 'main', '5005b8b86ed9b7ce11db570873ca49c000dbbb8d8b401839503d227406b8de96', '[\"*\"]', NULL, '2024-06-15 10:56:12', '2024-06-15 10:56:12'),
(23, 'App\\Models\\User', 51, 'main', '378b07ac9036405057ac2f43e4f0e3a0dc47f1e00ff3afdafbc1ff5bcc404475', '[\"*\"]', NULL, '2024-06-15 10:56:55', '2024-06-15 10:56:55'),
(24, 'App\\Models\\User', 51, 'main', '293d6ea5a2ac21acb6f19ed3b2afdd139a22d88f593634e7c9af23084f2744eb', '[\"*\"]', NULL, '2024-06-18 08:30:37', '2024-06-18 08:30:37'),
(25, 'App\\Models\\User', 51, 'main', 'c10f2c564279c1540a301b65ed00d75ee701bc971955a338d87f316ab3b9a263', '[\"*\"]', NULL, '2024-06-18 08:39:01', '2024-06-18 08:39:01'),
(26, 'App\\Models\\User', 51, 'main', '91f73ca9a91570119f04e0a20c8f17eed2e31eb5bd2b44dc1744e6a2a2623988', '[\"*\"]', NULL, '2024-06-18 08:44:48', '2024-06-18 08:44:48'),
(27, 'App\\Models\\User', 51, 'main', '4e72ab1f80ceab68e0e3139f8d5fe3e14e88f5ff9bfdfa9c433026d6cb84fd60', '[\"*\"]', NULL, '2024-06-18 09:02:06', '2024-06-18 09:02:06'),
(28, 'App\\Models\\User', 51, 'main', 'b92d4c634f882951f5ae9c4c506d80a7a185b5e4338b3913b7617da4c902d43a', '[\"*\"]', NULL, '2024-06-18 09:33:10', '2024-06-18 09:33:10'),
(29, 'App\\Models\\User', 51, 'main', 'd3a155f71545fdcfcfa08561a5907c91a75433893d33bb10cc5c5fd77147b2db', '[\"*\"]', NULL, '2024-06-18 09:38:42', '2024-06-18 09:38:42'),
(30, 'App\\Models\\User', 51, 'main', '2c6e0e45cdfea3b486d22c2b4ca7189b1c00ed230266833b3b6c5068ad588d8b', '[\"*\"]', NULL, '2024-06-18 09:42:14', '2024-06-18 09:42:14'),
(31, 'App\\Models\\User', 51, 'main', '326976fb898b40d966a37c4835e5523d2f2b5919cd0a32fa95664487f99d3b04', '[\"*\"]', NULL, '2024-06-18 09:43:02', '2024-06-18 09:43:02'),
(32, 'App\\Models\\User', 51, 'main', '58b9a1c757f3137bd8c41b2f57c43080d264a62fecf1ccefa744c2ba5db4afa3', '[\"*\"]', NULL, '2024-06-18 09:46:47', '2024-06-18 09:46:47'),
(33, 'App\\Models\\User', 51, 'main', 'd5a8e940d81583a262ec700a6dc0b229f716802b42ff537b2e296bb5240e1659', '[\"*\"]', NULL, '2024-06-18 09:51:10', '2024-06-18 09:51:10'),
(34, 'App\\Models\\User', 51, 'main', '3335dc11888149f37dd85c3c7ba943e9b7bbe4780e507e5c72f39594a50b64bf', '[\"*\"]', NULL, '2024-06-18 09:52:10', '2024-06-18 09:52:10'),
(35, 'App\\Models\\User', 51, 'main', '03d3ee5f1920051938066a230338bf061468200665f9650d181d04104429942a', '[\"*\"]', NULL, '2024-06-18 09:53:31', '2024-06-18 09:53:31'),
(36, 'App\\Models\\User', 51, 'main', 'ced351f2fe942322831509ea75e0d29e698fc14416429634479cc2a93d93f607', '[\"*\"]', NULL, '2024-06-18 09:57:00', '2024-06-18 09:57:00'),
(37, 'App\\Models\\User', 51, 'main', 'fe2cdf78fd01fa531111a06fad91323a15d33baaa8c62ddf6b2afb9cefb2a904', '[\"*\"]', NULL, '2024-06-18 10:00:18', '2024-06-18 10:00:18'),
(38, 'App\\Models\\User', 51, 'main', '297b565adfd936d63a117c05a9db67a886f5c8d9cdb62098b2dbe755d6f2a74a', '[\"*\"]', NULL, '2024-06-18 10:09:40', '2024-06-18 10:09:40'),
(39, 'App\\Models\\User', 62, 'main', '8d52088e0cc753ecac87368cdc4a02e69939f7621d360468f237de930ecfafc9', '[\"*\"]', NULL, '2024-06-18 10:10:23', '2024-06-18 10:10:23'),
(40, 'App\\Models\\User', 61, 'main', 'dcdc3ff2bc6dbdb9e1f3a95e668e8862a8e0cbad35877f60c95f7ab5aa119f36', '[\"*\"]', NULL, '2024-06-18 11:42:15', '2024-06-18 11:42:15'),
(41, 'App\\Models\\User', 51, 'main', 'b143e83f90edd713b75214459384ac2a5333cafd217596b6f65cbe71777e94de', '[\"*\"]', NULL, '2024-06-18 11:54:10', '2024-06-18 11:54:10'),
(42, 'App\\Models\\User', 51, 'main', 'ac70884d3eb93ee6821903e7bac2b4569b0635d2dff5582c652510e323e49ecd', '[\"*\"]', NULL, '2024-06-18 11:55:28', '2024-06-18 11:55:28'),
(43, 'App\\Models\\User', 61, 'main', '5df73094923ba4c9f95f617b81e31f8b1b5b7c60d416542e4e8fa52ccf2198c1', '[\"*\"]', NULL, '2024-06-18 12:14:46', '2024-06-18 12:14:46'),
(44, 'App\\Models\\User', 51, 'main', 'a1e25c121f5e15b91476a4a318db4a51266fc4927c9191fd273ba1b3ed1d34f2', '[\"*\"]', NULL, '2024-06-18 12:31:07', '2024-06-18 12:31:07'),
(45, 'App\\Models\\User', 51, 'main', 'c4e8856e579ee306df982f1c16d9d5da3054ed231fff880c36f6f1858f02cab9', '[\"*\"]', NULL, '2024-06-18 12:35:01', '2024-06-18 12:35:01'),
(46, 'App\\Models\\User', 51, 'main', '052721a0f50e2510b4f65f0edf6893768694b333239c3e77ed53045a37ff9be0', '[\"*\"]', NULL, '2024-06-18 12:36:40', '2024-06-18 12:36:40'),
(47, 'App\\Models\\User', 51, 'main', 'c222ca628ef85db2ccc144c91458cee0c09118f70510b2d3791bf5aaac94559a', '[\"*\"]', NULL, '2024-06-18 12:41:08', '2024-06-18 12:41:08'),
(48, 'App\\Models\\User', 51, 'main', 'dfe248e667dd30b033e10ab77217dc6ee99a97c64ef33933bc4814bca89e0190', '[\"*\"]', NULL, '2024-06-18 13:05:55', '2024-06-18 13:05:55'),
(49, 'App\\Models\\User', 51, 'main', '179f6f3fe1fcf9a7fc0f5bc9684463a7c1941b1d0f30a539fd5e55e3c86bc0ce', '[\"*\"]', NULL, '2024-06-18 14:03:03', '2024-06-18 14:03:03'),
(50, 'App\\Models\\User', 51, 'main', '1cbb463f925c3399b214ba70d71dc495895d9a7dc8265d4cc07bbd24acfdd50a', '[\"*\"]', NULL, '2024-06-18 14:15:58', '2024-06-18 14:15:58'),
(51, 'App\\Models\\User', 61, 'main', 'e4d93ec5d7af5c12051fbf5cec91f01c4e846cd90972c0eafb3f6581f209242b', '[\"*\"]', NULL, '2024-06-18 15:08:10', '2024-06-18 15:08:10'),
(52, 'App\\Models\\User', 51, 'main', '08c1c13b03c7f059b7554fc8d77be68ff54d29f3f804fba5fb55b45518c04e5a', '[\"*\"]', NULL, '2024-06-18 15:14:11', '2024-06-18 15:14:11'),
(53, 'App\\Models\\User', 51, 'main', '124a2a4a8eb9f93f072a7137f0215920d667701a4288fe9d4b17b60483cf618d', '[\"*\"]', NULL, '2024-06-18 15:16:01', '2024-06-18 15:16:01'),
(54, 'App\\Models\\User', 51, 'main', '770834d5843a7db64037e3a02b9dbd7fb397a5a632f4a7ce185cca815b479b9b', '[\"*\"]', NULL, '2024-06-18 15:18:43', '2024-06-18 15:18:43'),
(55, 'App\\Models\\User', 51, 'main', 'cdbac2f046eb2aa23ecc5fa499ba77dbc4558c2dc970f2f81a8711ae287ea980', '[\"*\"]', NULL, '2024-06-18 15:27:25', '2024-06-18 15:27:25'),
(56, 'App\\Models\\User', 51, 'main', '837577edf8ef286a14664c5bb11efcf3ed7d5b065596db70c474456cb7528e71', '[\"*\"]', NULL, '2024-06-18 15:28:40', '2024-06-18 15:28:40'),
(57, 'App\\Models\\User', 51, 'main', '91156b6d555dce70c0d43e2b905fe37062d28c6e039962d200a953fee6170621', '[\"*\"]', NULL, '2024-06-18 15:29:57', '2024-06-18 15:29:57'),
(58, 'App\\Models\\User', 63, 'main', '0fc42ec76a8397b6111e97cf9a6706994e72f54d4c4c012b12f79e2f4c8b8c5b', '[\"*\"]', NULL, '2024-06-18 15:34:54', '2024-06-18 15:34:54'),
(59, 'App\\Models\\User', 51, 'main', '1afdeda702f7d66608432da90090441e671053270ca9e27bc590f5b940a7f0aa', '[\"*\"]', NULL, '2024-06-18 15:38:17', '2024-06-18 15:38:17'),
(60, 'App\\Models\\User', 51, 'main', '5dffb0683e53d1b4cabaacd6ecd389715add77ffe39e79e6275cc859007a75f4', '[\"*\"]', NULL, '2024-06-18 15:44:56', '2024-06-18 15:44:56'),
(61, 'App\\Models\\User', 51, 'main', 'd52c7cfcf4f5b3039472d5b2f3d7d71c892a6f9841c9bbf1a85c215bb6074349', '[\"*\"]', NULL, '2024-06-18 16:02:49', '2024-06-18 16:02:49'),
(62, 'App\\Models\\User', 51, 'main', '0f3a404d149c45c7247f337ed2a6c08260b24d3a560445993f14862588ae0e2b', '[\"*\"]', NULL, '2024-06-20 08:01:53', '2024-06-20 08:01:53'),
(63, 'App\\Models\\User', 51, 'main', '442f5c3495bb1d0d1648adcd19bcd19062a4ebc986686f1edae9283dc3454f4e', '[\"*\"]', NULL, '2024-06-21 08:24:22', '2024-06-21 08:24:22'),
(64, 'App\\Models\\User', 51, 'main', 'b7ec38e6eabd17e96e724fe767c6ce3bf36afe6c9fb911c18fea0122aafca18b', '[\"*\"]', NULL, '2024-06-21 11:15:47', '2024-06-21 11:15:47'),
(65, 'App\\Models\\User', 61, 'main', 'd2d5daf141c17e994c3154da8604f522ceb7a56146ef540cf13199e26032f5fe', '[\"*\"]', NULL, '2024-06-21 14:48:37', '2024-06-21 14:48:37'),
(66, 'App\\Models\\User', 61, 'main', '2dfb9d64286d5425b40cd4af507e69b2651848e523b4edcec74bab22cb75f65a', '[\"*\"]', NULL, '2024-06-21 15:12:42', '2024-06-21 15:12:42'),
(67, 'App\\Models\\User', 61, 'main', '13917f9689106ffd48a935d5828b072aefc6f0adf75d68895a4ac705eed88ced', '[\"*\"]', NULL, '2024-06-21 15:19:35', '2024-06-21 15:19:35'),
(68, 'App\\Models\\User', 61, 'main', 'fbe1f5f2a79f22a4584a025380c0d3dd43ed3dc1a396afc074adb1cfbf6fc6bf', '[\"*\"]', NULL, '2024-06-22 08:19:11', '2024-06-22 08:19:11'),
(69, 'App\\Models\\User', 64, 'main', 'e0ae7f8458a3617faa3799a2c8a146c368bda42a8843ab71cc5c35f8417b8e55', '[\"*\"]', NULL, '2024-06-22 08:23:32', '2024-06-22 08:23:32'),
(70, 'App\\Models\\User', 61, 'main', 'c0545287802ae46210adc72d8ad63f5cd5d4a5bb5f3fa4939ea6cf1d34568a00', '[\"*\"]', NULL, '2024-06-22 08:53:03', '2024-06-22 08:53:03'),
(71, 'App\\Models\\User', 61, 'main', '4f489d1b0a15c4795dcc047bc5a6ccf24c6f3ac3283c8c7dad9d9cc09126ad87', '[\"*\"]', NULL, '2024-06-22 09:47:07', '2024-06-22 09:47:07'),
(72, 'App\\Models\\User', 51, 'main', '397075fd18d6cc52a7b323f7e614f7826be0bbc17057c3554aca4d5758f70fb3', '[\"*\"]', NULL, '2024-06-22 10:51:07', '2024-06-22 10:51:07'),
(73, 'App\\Models\\User', 51, 'main', '4423b250fb13b78baa809a86c819330f4410b6d451310f36b6e46ba4b593ce6e', '[\"*\"]', NULL, '2024-06-22 12:02:19', '2024-06-22 12:02:19'),
(74, 'App\\Models\\User', 51, 'main', '460f0c7f36b362ee49eba45717800ab1cf0d141d419b291a0b313e20ec8edb98', '[\"*\"]', NULL, '2024-06-22 12:21:27', '2024-06-22 12:21:27'),
(75, 'App\\Models\\User', 51, 'main', 'a7033f82839968f53026a6357c93abaa27b2f3300791b50a28be935e19602bab', '[\"*\"]', NULL, '2024-06-22 12:26:17', '2024-06-22 12:26:17'),
(76, 'App\\Models\\User', 51, 'main', 'a9517815a0ba5870801a34771ad6c932fe17e980e8349b50370eea8afc0fb54d', '[\"*\"]', NULL, '2024-06-22 12:31:57', '2024-06-22 12:31:57'),
(77, 'App\\Models\\User', 51, 'main', '99b499930b21efc6e0aa8c51f7b82fee1842aa63c6ce7c3991669e26d54ab328', '[\"*\"]', NULL, '2024-06-22 13:25:30', '2024-06-22 13:25:30'),
(78, 'App\\Models\\User', 61, 'main', '4d122cec42ea53cdeb8d322a0c110046911634d59828b2c962d2b1293b044a9d', '[\"*\"]', NULL, '2024-06-22 14:52:17', '2024-06-22 14:52:17'),
(79, 'App\\Models\\User', 51, 'main', '9ec2f7a12969150bf6a48c1b9f96dc6f038bcddc9bda735ed4daedef1d874562', '[\"*\"]', NULL, '2024-06-24 06:53:21', '2024-06-24 06:53:21'),
(80, 'App\\Models\\User', 51, 'main', '936d250decb08b9dcc3c5866f4e17d68f6fb18261708768f017ffb02da93bef1', '[\"*\"]', NULL, '2024-06-24 08:28:17', '2024-06-24 08:28:17'),
(81, 'App\\Models\\User', 51, 'main', 'd52c0159242343a50f543a199ef60cbe749ea3d2c9bed8eb320b0e009ee46a8f', '[\"*\"]', NULL, '2024-06-24 08:55:41', '2024-06-24 08:55:41'),
(82, 'App\\Models\\User', 51, 'main', '78c394357405dd1eada38dd43521e1a3bfc61855eeabb07e7f83102522406614', '[\"*\"]', NULL, '2024-06-24 08:58:23', '2024-06-24 08:58:23'),
(83, 'App\\Models\\User', 51, 'main', '13bc6bcd33b8df31cc0f7503889ca0f17eaea6efc90e56280cb9f9bd517e66f4', '[\"*\"]', NULL, '2024-06-24 08:59:44', '2024-06-24 08:59:44'),
(84, 'App\\Models\\User', 51, 'main', 'e8f9029b624845a4efa962c2ab8b2ca943e18d2c1cb512438e7e4e6ffd68d2ec', '[\"*\"]', NULL, '2024-06-24 09:01:47', '2024-06-24 09:01:47'),
(85, 'App\\Models\\User', 51, 'main', 'b70284e4578983975ebb86efc6620a925bc2e574e72697696e2ea7f8ce94f2d8', '[\"*\"]', NULL, '2024-06-24 09:04:47', '2024-06-24 09:04:47'),
(86, 'App\\Models\\User', 51, 'main', '709de8a83bf56c1abdb274065fe39480ba39bd721a90eb7f91ba15e1f15c6c12', '[\"*\"]', NULL, '2024-06-24 09:09:09', '2024-06-24 09:09:09'),
(87, 'App\\Models\\User', 51, 'main', 'c2eeccf13e1ccf5e827c65b387d25c5240b8930731af12e927e5b4905d0a0fd5', '[\"*\"]', NULL, '2024-06-24 09:13:45', '2024-06-24 09:13:45'),
(88, 'App\\Models\\User', 51, 'main', 'bf0634137481f0772e8e049e3af48f7cf4d2822ad927cdd6fe4f3281ad21b244', '[\"*\"]', NULL, '2024-06-24 09:35:03', '2024-06-24 09:35:03'),
(89, 'App\\Models\\User', 51, 'main', '842fad38ceee82afc96a18cfc53d4ff64b873cb1635a07409e700b5e132330c3', '[\"*\"]', NULL, '2024-06-24 09:39:17', '2024-06-24 09:39:17'),
(90, 'App\\Models\\User', 51, 'main', 'eacb1206a1034138204c4ff973f517a754e6bce421a349d7dec98aaec6ceea5f', '[\"*\"]', NULL, '2024-06-24 09:40:12', '2024-06-24 09:40:12'),
(91, 'App\\Models\\User', 51, 'main', 'a065a3f11116db00c2d9ddcd961e19017b649a2acc39ae24e09cfeeb07bb1c58', '[\"*\"]', NULL, '2024-06-24 09:42:36', '2024-06-24 09:42:36'),
(92, 'App\\Models\\User', 51, 'main', '8d5c9d17deefc616197a38ef54bd21c199001cbbb3f5892dfc85e79dbe4bcfe3', '[\"*\"]', NULL, '2024-06-24 10:03:15', '2024-06-24 10:03:15'),
(93, 'App\\Models\\User', 51, 'main', '1d67dec2c52e5a575a219f8cee72b7be56688925693b44bc8fc4a5997c698135', '[\"*\"]', NULL, '2024-06-24 10:06:12', '2024-06-24 10:06:12'),
(94, 'App\\Models\\User', 51, 'main', '90f17f904fdc5968b6e2d541a542694c903f988c8fe54fc8a59cad042cf609bf', '[\"*\"]', NULL, '2024-06-24 10:09:02', '2024-06-24 10:09:02'),
(95, 'App\\Models\\User', 51, 'main', '9c1a3708066f428567c06c8d780ef81e1abb7bc6e7ecc7d9b81a408a5ca5fbc4', '[\"*\"]', NULL, '2024-06-24 10:39:20', '2024-06-24 10:39:20'),
(96, 'App\\Models\\User', 51, 'main', '54299df012a2c5e33eae5f4063829e1ae1ed0646b8240a6d8cc461ff28750319', '[\"*\"]', NULL, '2024-06-24 10:43:54', '2024-06-24 10:43:54'),
(97, 'App\\Models\\User', 51, 'main', '80aa2f71f87893f05a67636557d9f056a3fd3a7143573c44605c3287a9c2f53a', '[\"*\"]', NULL, '2024-06-24 10:46:27', '2024-06-24 10:46:27'),
(98, 'App\\Models\\User', 51, 'main', '5cabd984227fd47ef792d1b1d937f01eb7673b6c5687d39796935ccb7222d7e8', '[\"*\"]', NULL, '2024-06-24 11:46:39', '2024-06-24 11:46:39'),
(99, 'App\\Models\\User', 51, 'main', '17656b6f754c630e75c28bb047adea701ac04363a2237c57f22db3b7f0abe9fe', '[\"*\"]', NULL, '2024-06-24 11:50:17', '2024-06-24 11:50:17'),
(100, 'App\\Models\\User', 51, 'main', 'ec848ac2f8d31c4355f7b301b622760935ff7a4c3850a470a7e74b74edf4bcea', '[\"*\"]', NULL, '2024-06-24 11:51:51', '2024-06-24 11:51:51'),
(101, 'App\\Models\\User', 51, 'main', 'bb8fef42429ad366ee5be5da2c7c3b732d68a4467bfac8a9ca14c5ea98fbf27b', '[\"*\"]', NULL, '2024-06-24 11:53:26', '2024-06-24 11:53:26'),
(102, 'App\\Models\\User', 51, 'main', 'ee28ea70918ec6efb5acca28aaec1d0d619baa733e0f4db39b75ffd68fa22d2d', '[\"*\"]', NULL, '2024-06-24 11:56:09', '2024-06-24 11:56:09'),
(103, 'App\\Models\\User', 51, 'main', '0fcc4aba2dffb74c9bf3c1cfae29852bab16c5c910642d264c129038c58c224b', '[\"*\"]', NULL, '2024-06-24 11:58:13', '2024-06-24 11:58:13'),
(104, 'App\\Models\\User', 51, 'main', '8182c2bfdf3ec6d3feb2aa2666f4301f6ef8023bd79577aead15357dd0e742d6', '[\"*\"]', NULL, '2024-06-24 12:02:09', '2024-06-24 12:02:09'),
(105, 'App\\Models\\User', 51, 'main', 'd5a6de1ed699964fb0c6c097ee57d2a51ce9c5ee3371e23d4770d89139e62a31', '[\"*\"]', NULL, '2024-06-24 12:08:05', '2024-06-24 12:08:05'),
(106, 'App\\Models\\User', 51, 'main', 'd0d937ff3dc1797deb7cfd444cef45e7609d2f159a37bc0893f7514b88480f1f', '[\"*\"]', NULL, '2024-07-05 12:54:04', '2024-07-05 12:54:04'),
(107, 'App\\Models\\User', 51, 'main', '62db812c9f3d3ef3e47b0029b8c057c9f2e9397cb0505a0c6667a784476db1ec', '[\"*\"]', NULL, '2024-07-05 12:57:56', '2024-07-05 12:57:56'),
(108, 'App\\Models\\User', 64, 'main', 'd7e766450b63616da0b795e3bb8d1ed860573117f1329701d804d61746f8b0b0', '[\"*\"]', NULL, '2024-07-05 12:59:30', '2024-07-05 12:59:30'),
(109, 'App\\Models\\User', 51, 'main', 'eb044badb6d768f66965f34b545870ff8a3e0bbf8abb8d98fadd424dd62f6e93', '[\"*\"]', NULL, '2024-07-05 13:05:04', '2024-07-05 13:05:04'),
(110, 'App\\Models\\User', 64, 'main', 'bb15c275f05423ec80ee40e73c831f0b83ac0e8416ac0e0198b3ded188b7289a', '[\"*\"]', NULL, '2024-07-05 13:07:10', '2024-07-05 13:07:10'),
(111, 'App\\Models\\User', 51, 'main', '3f4b1f64ab777b7060dc377c3db2f2c0b0eacc5b4459c388c41e88776baed266', '[\"*\"]', NULL, '2024-07-05 15:07:56', '2024-07-05 15:07:56'),
(112, 'App\\Models\\User', 51, 'main', 'a2035ce01b91dec05c5fd89aa94e7ee227b43a5ae0309a8c10e17befd90774b8', '[\"*\"]', NULL, '2024-07-06 07:55:49', '2024-07-06 07:55:49'),
(113, 'App\\Models\\User', 51, 'main', '8e83ca8570fb7eaeb7948697158cd8eaba00f99c1de344c7013805ea09723dfe', '[\"*\"]', NULL, '2024-07-10 15:07:17', '2024-07-10 15:07:17'),
(114, 'App\\Models\\User', 51, 'main', '7d415a4aef46cb889ab480518cc64261889b68484c22dd0e5bb66083ef595d2e', '[\"*\"]', NULL, '2024-07-10 15:18:08', '2024-07-10 15:18:08'),
(115, 'App\\Models\\User', 51, 'main', 'a6169c3fd0a995dd9b49918f2812ee4e74685d2acc1430d45980d6ed7d891bc9', '[\"*\"]', NULL, '2024-07-10 15:22:58', '2024-07-10 15:22:58'),
(116, 'App\\Models\\User', 51, 'main', '0ec3e656ba5854bb9524f945efcd5653f3ef0c6ae4370d919e3870b7462ea913', '[\"*\"]', NULL, '2024-07-10 15:23:26', '2024-07-10 15:23:26'),
(117, 'App\\Models\\User', 51, 'main', '3845b5ad9d489e0a1ee9da044265da6adad984c6571faa5695628974e23b2021', '[\"*\"]', NULL, '2024-07-10 15:26:49', '2024-07-10 15:26:49'),
(118, 'App\\Models\\User', 51, 'main', '247ea87bcef4f67c1ea76f565271efc1c7688b2b1d6007792ffe2385e2e36d6b', '[\"*\"]', NULL, '2024-07-10 15:29:47', '2024-07-10 15:29:47'),
(119, 'App\\Models\\User', 51, 'main', 'db79eaa94bec7f2d2adf9e70e1682ad5174b352f23a2d71ce9a6fda45627b071', '[\"*\"]', NULL, '2024-07-10 15:35:55', '2024-07-10 15:35:55'),
(120, 'App\\Models\\User', 51, 'main', '2a1e2f86f5547f9a921fe30df8ac24c5d47014241bdfb34483efa939594386a3', '[\"*\"]', NULL, '2024-07-10 15:45:40', '2024-07-10 15:45:40'),
(121, 'App\\Models\\User', 51, 'main', '4a31a79ff47ce05f8a64f5b36c4aa2d8e46dc8f83642e587e3d4482865628497', '[\"*\"]', NULL, '2024-07-10 15:58:23', '2024-07-10 15:58:23'),
(122, 'App\\Models\\User', 51, 'main', '9b78feb3fea583eb7bdd8effb0873a36c320a317573ed0fe4fea532b56be06de', '[\"*\"]', NULL, '2024-07-10 16:07:59', '2024-07-10 16:07:59'),
(123, 'App\\Models\\User', 51, 'main', 'efef27620b6e034479b852850e028fbaa7431cf34874f2a7fe23c29b99308ed8', '[\"*\"]', NULL, '2024-07-10 16:11:32', '2024-07-10 16:11:32'),
(124, 'App\\Models\\User', 51, 'main', '612022a4d680734d6e5a997fddacfdeb8fa90b9806aed601e455f54f8e4fc4e0', '[\"*\"]', NULL, '2024-07-10 16:18:53', '2024-07-10 16:18:53'),
(125, 'App\\Models\\User', 51, 'main', 'f33bf92137160853dcabe0888d0ec8304813254d2503fb4ff7be62240f10a4b0', '[\"*\"]', NULL, '2024-07-10 16:21:34', '2024-07-10 16:21:34'),
(126, 'App\\Models\\User', 51, 'main', '55ce8fac9935de4b96c3307da8c4fc6436562f12b775dfa0679c5d42a5a33175', '[\"*\"]', NULL, '2024-07-10 16:35:09', '2024-07-10 16:35:09'),
(127, 'App\\Models\\User', 51, 'main', '1166b0f19fd3abbc8d36ec4d96f29f6da96b6dcc60664448a0c5fc9d411678cb', '[\"*\"]', NULL, '2024-07-10 16:42:27', '2024-07-10 16:42:27'),
(128, 'App\\Models\\User', 51, 'main', '8a5d6a5e3ae4b8b0b50a27d9293bf056473ba94c4add29c0c94b9da48db27e75', '[\"*\"]', NULL, '2024-07-10 16:47:35', '2024-07-10 16:47:35'),
(129, 'App\\Models\\User', 51, 'main', '5869cafb934387f0e2376b2ca32ef71fa2e2d093eca67d050895fa76959fae09', '[\"*\"]', NULL, '2024-07-10 16:51:57', '2024-07-10 16:51:57'),
(130, 'App\\Models\\User', 51, 'main', 'd2aba2f737f3df51a6271120388c1c46f986a32e9af462d37f3f0c50debe1fad', '[\"*\"]', NULL, '2024-07-10 16:55:03', '2024-07-10 16:55:03'),
(131, 'App\\Models\\User', 65, 'main', 'eba9e252a1a77edeff09f9dff6bdbc4e6fc94415d7ef424a22d132fcffe0b494', '[\"*\"]', NULL, '2024-07-11 04:49:44', '2024-07-11 04:49:44'),
(132, 'App\\Models\\User', 65, 'main', '47303c6c62638e44d0b6812627151e1308284a0d774f84709ed9815034fb3d3d', '[\"*\"]', NULL, '2024-07-11 04:50:38', '2024-07-11 04:50:38'),
(133, 'App\\Models\\User', 65, 'main', '713ab22845aa2077c23fffae7c8d9c2d61133b3a3ba314034461f0e42e8f34f0', '[\"*\"]', NULL, '2024-07-11 04:51:15', '2024-07-11 04:51:15'),
(134, 'App\\Models\\User', 65, 'main', '1d1090bfd8f9bd896abdc6528e087f03ef79c898ff4b9241537703e1b01a74e6', '[\"*\"]', NULL, '2024-07-11 04:53:14', '2024-07-11 04:53:14'),
(135, 'App\\Models\\User', 65, 'main', '7fcb2156b275a1eaac9af2ef762fbac64602a4e6f7c0435b16d648a0c1b6fa26', '[\"*\"]', NULL, '2024-07-11 04:58:19', '2024-07-11 04:58:19'),
(136, 'App\\Models\\User', 65, 'main', '3993d78212fb86a72917a83a73be885ef63016087034af582748d5a9efe53ab8', '[\"*\"]', NULL, '2024-07-11 04:59:55', '2024-07-11 04:59:55'),
(137, 'App\\Models\\User', 65, 'main', '7afc1c41a9ce4decee070c3310e514ebb8efabdb62518937d3c661dff336df24', '[\"*\"]', NULL, '2024-07-11 05:01:21', '2024-07-11 05:01:21'),
(138, 'App\\Models\\User', 65, 'main', 'f6adde0250e0b7b8758b4bd4b7be9d278bb9f30acc5a3b90d74fca48cb46e06a', '[\"*\"]', NULL, '2024-07-11 05:07:02', '2024-07-11 05:07:02'),
(139, 'App\\Models\\User', 65, 'main', '1c77f26e67215405d0055195cf84845d70bc86d1428ee34163643d8397302c69', '[\"*\"]', NULL, '2024-07-11 05:22:36', '2024-07-11 05:22:36'),
(140, 'App\\Models\\User', 65, 'main', '17032fe5f8185849232d8dce97541215403e49c7d4e2076c5e48b1db1d639c72', '[\"*\"]', NULL, '2024-07-11 05:24:41', '2024-07-11 05:24:41'),
(141, 'App\\Models\\User', 65, 'main', '22bea434363926c0b59f574d4382084ff0bdbfb938824ddf2ecf68e820d088ee', '[\"*\"]', NULL, '2024-07-11 07:16:53', '2024-07-11 07:16:53'),
(142, 'App\\Models\\User', 65, 'main', 'fb07cca50aba3c8af98561021704b04277f832dc194c5a01736ed280793ee868', '[\"*\"]', NULL, '2024-07-11 09:07:03', '2024-07-11 09:07:03'),
(143, 'App\\Models\\User', 65, 'main', '8c6cf9972671e086dfae084499576e623fa0a25fb285c27e59c856fb1e2ecaff', '[\"*\"]', NULL, '2024-07-11 09:12:21', '2024-07-11 09:12:21'),
(144, 'App\\Models\\User', 65, 'main', '167ae665a4e4de2592daf69d584859a83a9e43c35f72b3b4742dc375066c30e5', '[\"*\"]', NULL, '2024-07-11 09:41:40', '2024-07-11 09:41:40'),
(145, 'App\\Models\\User', 65, 'main', 'c635258cd1303f7a059f1ac6a69792118512a3b9212b44d1a6445ed7b3f3d388', '[\"*\"]', NULL, '2024-07-11 10:30:21', '2024-07-11 10:30:21'),
(146, 'App\\Models\\User', 65, 'main', 'f13c4576bd369154b173768a22cc45057dd5abc514d108ea49edb1b52dd95bbf', '[\"*\"]', NULL, '2024-07-11 10:49:43', '2024-07-11 10:49:43'),
(147, 'App\\Models\\User', 65, 'main', '1dfb205b5e6e2d025197b56b08614cf18854c9253492d56473e57d856da96023', '[\"*\"]', NULL, '2024-07-11 10:55:27', '2024-07-11 10:55:27'),
(148, 'App\\Models\\User', 65, 'main', '23a3cc60b43ec46a925255e67327f85099fc653fd2218f43e6a5fd5d72286169', '[\"*\"]', NULL, '2024-07-11 11:46:23', '2024-07-11 11:46:23'),
(149, 'App\\Models\\User', 65, 'main', '47a2e6ce61775a6ffb1fbaf50e4179ac6c01756219360595951de2266e244346', '[\"*\"]', NULL, '2024-07-11 12:10:13', '2024-07-11 12:10:13'),
(150, 'App\\Models\\User', 65, 'main', '741b5d6efcdecdf0579a7aa10ab93fca5cd4843b654f4582f350b4bdce223064', '[\"*\"]', NULL, '2024-07-11 12:18:48', '2024-07-11 12:18:48'),
(151, 'App\\Models\\User', 51, 'main', '22f5b352353529ad5390ca086f6c7c56c10e772fc9fba8e2e48a8ec977a08438', '[\"*\"]', NULL, '2024-07-11 14:12:00', '2024-07-11 14:12:00'),
(152, 'App\\Models\\User', 51, 'main', 'ba92de2b230820bf3664b7c1ff4e46b2650077d4715294494b5ae9dfbf18b922', '[\"*\"]', NULL, '2024-07-11 14:12:37', '2024-07-11 14:12:37'),
(153, 'App\\Models\\User', 51, 'main', '6d61f4f2682896f12d0cf1b1919faf2e525eb063543d93253d51c49a0f5ad9bd', '[\"*\"]', NULL, '2024-07-11 16:04:33', '2024-07-11 16:04:33'),
(154, 'App\\Models\\User', 65, 'main', '0ca2d61693fc635586ebd2746aaedc504d23420587e03ec4e1024497d667788c', '[\"*\"]', NULL, '2024-07-11 16:07:18', '2024-07-11 16:07:18'),
(155, 'App\\Models\\User', 51, 'main', 'f38c6027872e7269c9a22698603200a4a552dcd979b5c1b906288d98fa248bb2', '[\"*\"]', NULL, '2024-07-11 16:08:28', '2024-07-11 16:08:28'),
(156, 'App\\Models\\User', 51, 'main', '2eba5d6db50df1c62d60331428fae1ee0be99fd344b6e54b0a01bbe1552833fe', '[\"*\"]', NULL, '2024-07-11 16:13:07', '2024-07-11 16:13:07'),
(157, 'App\\Models\\User', 51, 'main', 'da5dc5c0e412185af64dabcae24d7588edb6eba3636eecc15f1c6d763f671cff', '[\"*\"]', NULL, '2024-07-11 16:14:09', '2024-07-11 16:14:09'),
(158, 'App\\Models\\User', 51, 'main', '7b3e9c3e1df6466f1bf337c7c2a9c5c7b7179d65e3cf7928bf4f25e0365e6f16', '[\"*\"]', NULL, '2024-07-11 16:17:01', '2024-07-11 16:17:01'),
(159, 'App\\Models\\User', 51, 'main', '9c3f9e37fae5f7103e704aa28f8b2780ed19c7f801ea1e656be533683d06549c', '[\"*\"]', NULL, '2024-07-11 16:18:21', '2024-07-11 16:18:21'),
(160, 'App\\Models\\User', 51, 'main', 'c941e93efbc98174d6dfd2381d75b5380cca1e35ba7e981510d1cf5007721496', '[\"*\"]', NULL, '2024-07-11 16:21:26', '2024-07-11 16:21:26'),
(161, 'App\\Models\\User', 51, 'main', '9f908eacfd6570b3247c4f268d75484540bc45b347f043c5945151f8ffc7022d', '[\"*\"]', NULL, '2024-07-12 07:36:50', '2024-07-12 07:36:50'),
(162, 'App\\Models\\User', 51, 'main', '43d8ef5550759e7ba7b83125258447266d914eda5f1836e250729120e874fded', '[\"*\"]', NULL, '2024-07-12 07:37:27', '2024-07-12 07:37:27'),
(163, 'App\\Models\\User', 51, 'main', '005d834f7eb517acd67f1cab7c6177c96bc1e49476522e0221aa252ded99c4c8', '[\"*\"]', NULL, '2024-07-12 07:38:11', '2024-07-12 07:38:11'),
(164, 'App\\Models\\User', 65, 'main', 'a69d2a537e5012aa2b601fff672e56a74a8c7211b3293f0a356fe26eec4d3cf5', '[\"*\"]', NULL, '2024-07-12 14:56:28', '2024-07-12 14:56:28'),
(165, 'App\\Models\\User', 51, 'main', '2b8179771ff3cfa4e6622dbf3fa7840fdfe9003afbf0f14f9e9c2fe376367587', '[\"*\"]', NULL, '2024-07-12 14:56:44', '2024-07-12 14:56:44'),
(166, 'App\\Models\\User', 51, 'main', '689b4fb547751480280d05311b60ae2314185048dfa522153bf0463be802438a', '[\"*\"]', NULL, '2024-07-12 14:58:32', '2024-07-12 14:58:32'),
(167, 'App\\Models\\User', 51, 'main', 'df3ce262d645325815e6f1201d22598f87b97b87e7f4550a1c73893b4f55859d', '[\"*\"]', NULL, '2024-07-12 15:01:23', '2024-07-12 15:01:23'),
(168, 'App\\Models\\User', 51, 'main', 'f8e75f953ecb1c02bab9a78955949fc70cf9ecb42621200ffdbe594304c2fa08', '[\"*\"]', NULL, '2024-07-12 15:07:02', '2024-07-12 15:07:02'),
(169, 'App\\Models\\User', 65, 'main', 'bb609d91417af133d6e59ef612d3707d374daecaafd0bb83d62aaaaebdef8a4d', '[\"*\"]', NULL, '2024-07-12 15:40:36', '2024-07-12 15:40:36'),
(170, 'App\\Models\\User', 51, 'main', '89595d5072584dc706927f02bb00d60c7dff751af951ca8a3090a008febe4ae5', '[\"*\"]', NULL, '2024-07-12 15:48:59', '2024-07-12 15:48:59'),
(171, 'App\\Models\\User', 65, 'main', '824764068d7453866f5a7dbb38b0fcb1ac85c20cf678067a328e5604442bcc17', '[\"*\"]', NULL, '2024-07-12 16:05:40', '2024-07-12 16:05:40'),
(172, 'App\\Models\\User', 51, 'main', 'b5aa49736250dac414b7e2172a4745eef4d33f1edf137f2a140f71270724f744', '[\"*\"]', NULL, '2024-08-05 13:56:16', '2024-08-05 13:56:16'),
(173, 'App\\Models\\User', 51, 'main', '55107af54d5eda418f78c3634eb34331badeff64293fa2f8d7b63f241258efea', '[\"*\"]', NULL, '2024-08-07 09:50:19', '2024-08-07 09:50:19'),
(174, 'App\\Models\\User', 51, 'main', 'a18ccdd77b92c2793a08d5b56bba1632b09c8d0523e8a2f4e343e7d8ef66c7a6', '[\"*\"]', NULL, '2024-08-07 09:54:18', '2024-08-07 09:54:18'),
(175, 'App\\Models\\User', 51, 'main', '42efd316c81e12c4e10f32be7d0a3e5073b7835512a27d54624e7201a591c66e', '[\"*\"]', NULL, '2024-08-07 09:55:28', '2024-08-07 09:55:28'),
(176, 'App\\Models\\User', 51, 'main', 'c9fd492d831d8b459f9b23eb1af2e5a091ddbe8dc4e1d3bba72dd326ea137dc9', '[\"*\"]', NULL, '2024-08-07 10:03:43', '2024-08-07 10:03:43'),
(177, 'App\\Models\\User', 51, 'main', 'ffb15f81bfb4383935a809e6044c74b4fb42f037a5257544617f70c971069a22', '[\"*\"]', NULL, '2024-08-07 10:04:11', '2024-08-07 10:04:11'),
(178, 'App\\Models\\User', 51, 'main', '52611883604045a60a39419025e91cbbe417527e549722b028c552b54c487eab', '[\"*\"]', NULL, '2024-08-07 10:05:11', '2024-08-07 10:05:11'),
(179, 'App\\Models\\User', 51, 'main', '5c5a3438b1cdcea9353e7eb0a21510a172d91bf8752a31691f5a25e4644955d8', '[\"*\"]', NULL, '2024-08-07 10:06:03', '2024-08-07 10:06:03'),
(180, 'App\\Models\\User', 51, 'main', '24a6b642f38ba6d249c5e04100c40269913ded045442cca3fd4a60fd8080438e', '[\"*\"]', NULL, '2024-08-07 10:06:55', '2024-08-07 10:06:55'),
(181, 'App\\Models\\User', 51, 'main', 'd24b2cff326e66decab3831a04749787765fbf48eb2b0969ca464ef0017ead62', '[\"*\"]', NULL, '2024-08-07 12:22:32', '2024-08-07 12:22:32'),
(182, 'App\\Models\\User', 51, 'main', '7d20257ea68564b969d1dc07f1f0cb73b5c26434dc7ce915c314339758b79087', '[\"*\"]', NULL, '2024-08-07 12:28:08', '2024-08-07 12:28:08'),
(183, 'App\\Models\\User', 51, 'main', '4d7c6020440147805e1c1a301dc033e27fb05494a1e1ad4d642104e6d6e673d6', '[\"*\"]', NULL, '2024-08-07 12:34:07', '2024-08-07 12:34:07'),
(184, 'App\\Models\\User', 51, 'main', 'b9f92d2116941bb9a864eceb13b2b2d12f936ffffcba10d89c2490f6c47c6ed6', '[\"*\"]', NULL, '2024-08-07 12:52:22', '2024-08-07 12:52:22'),
(185, 'App\\Models\\User', 51, 'main', '4941dcd2546abf906c52fb99a0e735b5e5c2b1c5e092b09d1b018f2387374cd4', '[\"*\"]', NULL, '2024-08-07 12:54:45', '2024-08-07 12:54:45'),
(186, 'App\\Models\\User', 51, 'main', '1a5a142c53b0c674c2358f478976c85e40b1bf3bd72d41fd3123e7c075146015', '[\"*\"]', NULL, '2024-08-07 12:55:37', '2024-08-07 12:55:37'),
(187, 'App\\Models\\User', 66, 'main', '634926847dbceef9595c748aef2e00fe4123ec5b6c2e2957cc9ecf93f6e4e302', '[\"*\"]', NULL, '2024-08-07 12:58:45', '2024-08-07 12:58:45'),
(188, 'App\\Models\\User', 51, 'main', '223558d970bc1b89dcb58e78ec804ab07f19629bf48e894ca62fac58950da261', '[\"*\"]', NULL, '2024-08-07 13:03:09', '2024-08-07 13:03:09'),
(189, 'App\\Models\\User', 51, 'main', '57c0022417c9e77167acff5c6fe8af6948c29f7bef7f01a135f9f4c333ffb5eb', '[\"*\"]', NULL, '2024-08-07 13:07:11', '2024-08-07 13:07:11'),
(190, 'App\\Models\\User', 51, 'main', '09adae1e4288f04e7ae37522e96dc8f79ac97032c7b78396fc1a1173fbfc397d', '[\"*\"]', NULL, '2024-08-07 13:08:26', '2024-08-07 13:08:26'),
(191, 'App\\Models\\User', 51, 'main', '6a67408712223334c95f308fc4916b753ee5b126e5266c0d2dc4e20e1a253a9f', '[\"*\"]', NULL, '2024-08-07 13:19:12', '2024-08-07 13:19:12'),
(192, 'App\\Models\\User', 51, 'main', '36425e1cde6cf5ba9d4338a0ee6635ed080a0cbf25032a87438072a0328147f2', '[\"*\"]', NULL, '2024-08-07 13:29:38', '2024-08-07 13:29:38'),
(193, 'App\\Models\\User', 51, 'main', '99b4befee756116530463602dfc77a427ad4829771845533569cee2935b94ac3', '[\"*\"]', NULL, '2024-08-07 13:40:29', '2024-08-07 13:40:29'),
(194, 'App\\Models\\User', 51, 'main', '180ddb732b055834d70e9b8415076ef154d4f7c01a7161e70990c8e8cd9c11a3', '[\"*\"]', NULL, '2024-08-07 14:55:13', '2024-08-07 14:55:13'),
(195, 'App\\Models\\User', 51, 'main', 'f3a3c6cba67250b3fc0450f081ed8565f3c7e70c4bc0baf664900c07837d564a', '[\"*\"]', NULL, '2024-08-07 15:00:16', '2024-08-07 15:00:16'),
(196, 'App\\Models\\User', 51, 'main', '4022cd2d0a9a0a0ba32893b9ed971db035363ccb4e9102f93f37cf535de132a1', '[\"*\"]', NULL, '2024-08-08 07:49:32', '2024-08-08 07:49:32'),
(197, 'App\\Models\\User', 51, 'main', '7ecb49d70d1d99f26c2ed89fda0ee45681d4484f5d42cb12fc434508c29daeba', '[\"*\"]', NULL, '2024-08-08 07:55:52', '2024-08-08 07:55:52'),
(198, 'App\\Models\\User', 51, 'main', '5ffcc2000101edf7b32d4ad86131c68795091456a5073c5910799acc1bdee838', '[\"*\"]', NULL, '2024-08-08 07:59:34', '2024-08-08 07:59:34'),
(199, 'App\\Models\\User', 51, 'main', '20f874417a2d43f44f20065333db7eeff42bc5c77e25faece866512f1127b7fb', '[\"*\"]', NULL, '2024-08-08 08:17:45', '2024-08-08 08:17:45'),
(200, 'App\\Models\\User', 51, 'main', 'd8a88e19c373348a180dab4722b7fabf13f4de7df35bf8bc12b51beb7418a50a', '[\"*\"]', NULL, '2024-08-08 08:18:43', '2024-08-08 08:18:43'),
(201, 'App\\Models\\User', 51, 'main', '899301f365b16e7557d855ca814f85c1a8e6d8b2c38e29d42fe5d1e52402b5d7', '[\"*\"]', NULL, '2024-08-08 08:32:02', '2024-08-08 08:32:02'),
(202, 'App\\Models\\User', 51, 'main', 'd7c650840d5be3067d304400b0c92660899b6c390138c4ab0e3b7b279eae7d04', '[\"*\"]', NULL, '2024-08-08 08:37:58', '2024-08-08 08:37:58'),
(203, 'App\\Models\\User', 51, 'main', '084964b0959c2ab477c79d5a266b75089c9b28eed865be6c0ba725bd08326550', '[\"*\"]', NULL, '2024-08-08 08:40:30', '2024-08-08 08:40:30'),
(204, 'App\\Models\\User', 51, 'main', 'bcc5ebf61a7357b73671968e22f6419c4acb6a971f8abf1dad5f8a2d09eaf381', '[\"*\"]', NULL, '2024-08-08 08:48:24', '2024-08-08 08:48:24'),
(205, 'App\\Models\\User', 51, 'main', '03a3fcc3b82b4e75223a2f674065a77d6caea22e44392bde5a4fc9f29a78ea82', '[\"*\"]', NULL, '2024-08-08 08:56:33', '2024-08-08 08:56:33'),
(206, 'App\\Models\\User', 51, 'main', '3a595bedb7722d5cb9adf9db2da0aed4f078cc7a4945e8ed9c0dffcd68ad7ad9', '[\"*\"]', NULL, '2024-08-08 09:14:04', '2024-08-08 09:14:04'),
(207, 'App\\Models\\User', 51, 'main', '11abb8f858b9a8ae823fd4b52f97caf3fb40b4205b0f3c7f0c9cb58e3b008f4a', '[\"*\"]', NULL, '2024-08-08 09:17:59', '2024-08-08 09:17:59'),
(208, 'App\\Models\\User', 51, 'main', 'e1003487da3a3ce5d10fe73a13e9ef176746466953f96f35e3e07445ec1ad8e5', '[\"*\"]', NULL, '2024-08-08 09:21:58', '2024-08-08 09:21:58'),
(209, 'App\\Models\\User', 51, 'main', '415a73df8ba64a9a69b758f1691147ff42ca597855321e29b038152c183fc368', '[\"*\"]', NULL, '2024-08-08 09:23:15', '2024-08-08 09:23:15'),
(210, 'App\\Models\\User', 51, 'main', 'd4e972c23379db607b4e952704d05787baa881ea32f9697fa0b6aa630a46d257', '[\"*\"]', NULL, '2024-08-08 09:27:41', '2024-08-08 09:27:41'),
(211, 'App\\Models\\User', 51, 'main', '045b99dfb8591cd9baeacc5dbae72c717febbcedfea97288aaacc679007658ba', '[\"*\"]', NULL, '2024-08-08 09:34:54', '2024-08-08 09:34:54'),
(212, 'App\\Models\\User', 51, 'main', '665b30e4c2587071040499bc28c48af1e38c98e8b3e31c41efd9253314896b7e', '[\"*\"]', NULL, '2024-08-08 09:41:16', '2024-08-08 09:41:16'),
(213, 'App\\Models\\User', 51, 'main', '50a202b47068e7c2819da48dfc24e56e444b74f85745fd1da49219815fc0760b', '[\"*\"]', NULL, '2024-08-08 09:52:43', '2024-08-08 09:52:43'),
(214, 'App\\Models\\User', 51, 'main', '31de38dd1fa133b885ca034057c602cf49084488a00051ed525701f901d838b4', '[\"*\"]', NULL, '2024-08-08 10:00:56', '2024-08-08 10:00:56'),
(215, 'App\\Models\\User', 51, 'main', '5e691016ff128a1266bd6707cf03d0b26225e1bec3a64c53e5f15f26dc60a78f', '[\"*\"]', NULL, '2024-08-08 10:02:11', '2024-08-08 10:02:11'),
(216, 'App\\Models\\User', 51, 'main', 'abb45830278da45c41c92c627d2c26b458a098b36f30309d9d710fa167778e6f', '[\"*\"]', NULL, '2024-08-08 10:02:56', '2024-08-08 10:02:56'),
(217, 'App\\Models\\User', 51, 'main', '8767900f98a051a37b912b150bc919bcca0e3a00926f9dbf137b5851c03ad0ae', '[\"*\"]', NULL, '2024-08-08 10:19:27', '2024-08-08 10:19:27'),
(218, 'App\\Models\\User', 51, 'main', '5770b589540afdea7fd78cb372301e6d6971da44ed8a05465a725320c2278a6c', '[\"*\"]', NULL, '2024-08-08 10:21:46', '2024-08-08 10:21:46'),
(219, 'App\\Models\\User', 51, 'main', '0d697294463851c4a5bdd0d1d940c9ad4a1b791f2dc42110df8ec0deba42f6a0', '[\"*\"]', NULL, '2024-08-08 10:23:05', '2024-08-08 10:23:05'),
(220, 'App\\Models\\User', 51, 'main', '8a5bdb5fa4fae96d5da04589dd13586d8a5da5889376b6f7f640506acd9297d7', '[\"*\"]', NULL, '2024-08-08 10:24:56', '2024-08-08 10:24:56'),
(221, 'App\\Models\\User', 51, 'main', 'd706a752cf93ab482959a05e7e6f1cfb135f31e4ab760d3e7721363074d7e8c0', '[\"*\"]', NULL, '2024-08-08 10:25:43', '2024-08-08 10:25:43'),
(222, 'App\\Models\\User', 51, 'main', '344f02126d3daccc973c0eb96fd5f717b5ede82dc446bf30a37b8887b4681944', '[\"*\"]', NULL, '2024-08-08 10:32:21', '2024-08-08 10:32:21'),
(223, 'App\\Models\\User', 51, 'main', '7b4f495ca21930e47336e74d9ffefac7f7a89fa47edd8bf7498f2d4ec026b607', '[\"*\"]', NULL, '2024-08-08 10:34:12', '2024-08-08 10:34:12'),
(224, 'App\\Models\\User', 51, 'main', '81d42a952f6c5f3f5f076ec96631717aa2781aecbd1a05faba98afb486b5d44c', '[\"*\"]', NULL, '2024-08-08 12:24:10', '2024-08-08 12:24:10'),
(225, 'App\\Models\\User', 51, 'main', 'be4378b64428c50cba9594ae341bbab973d4ae4fdf994c7b378e817fa6fdb882', '[\"*\"]', NULL, '2024-08-08 12:41:28', '2024-08-08 12:41:28'),
(226, 'App\\Models\\User', 51, 'main', '1ddf1c39ee7283471137c855760411d2b3421af27836d1fcf0232922b95e8e9a', '[\"*\"]', NULL, '2024-08-09 14:37:19', '2024-08-09 14:37:19'),
(227, 'App\\Models\\User', 51, 'main', 'd027debf00ee52139062fc1d61237224658518dafeee124383930f332a28a478', '[\"*\"]', NULL, '2024-08-09 14:41:17', '2024-08-09 14:41:17'),
(228, 'App\\Models\\User', 51, 'main', 'ab587bd432d79bbd807a132ac257cc583278cb87675cc1b2e1af1ed96b7d3bf1', '[\"*\"]', NULL, '2024-08-09 14:42:40', '2024-08-09 14:42:40'),
(229, 'App\\Models\\User', 51, 'main', '73aeabfdba56eb9c00ffeaba0d76d50ae94238f170228a578dfd60ce89e87f59', '[\"*\"]', NULL, '2024-08-09 14:54:55', '2024-08-09 14:54:55'),
(230, 'App\\Models\\User', 51, 'main', '4cee66a989d3a8bd9a64fa9efc5e695e7c4f5ae28f48340af8d78d367403b338', '[\"*\"]', NULL, '2024-08-09 14:55:25', '2024-08-09 14:55:25'),
(231, 'App\\Models\\User', 51, 'main', '1914d02482638ca7df83061293a2abb3d0cdbfd2b8b8db9612749c8e74d15403', '[\"*\"]', NULL, '2024-08-09 15:02:42', '2024-08-09 15:02:42'),
(232, 'App\\Models\\User', 51, 'main', '95a0c3e922c383d246fb0443aa37a8ba55bf73dbeb2ea53e1aae7d08356529cd', '[\"*\"]', NULL, '2024-08-09 15:06:33', '2024-08-09 15:06:33'),
(233, 'App\\Models\\User', 51, 'main', 'f5a31f2f89484a7619c31c21f288b7057f542ce9d205e1e38c43c3bf267784c7', '[\"*\"]', NULL, '2024-08-09 15:10:59', '2024-08-09 15:10:59'),
(234, 'App\\Models\\User', 51, 'main', '1b53a134064094bfe7112ca5559ae42d66f007dca445d1324cbaf44274e432b4', '[\"*\"]', NULL, '2024-08-09 15:27:17', '2024-08-09 15:27:17'),
(235, 'App\\Models\\User', 51, 'main', '3eeb3d7de6ae6c316501c499f969f50f1e1d1a5821484e5135be281f93cb180a', '[\"*\"]', NULL, '2024-08-09 15:31:13', '2024-08-09 15:31:13'),
(236, 'App\\Models\\User', 51, 'main', '8687efd98910f25bda2b83c00c2c8f0a48fad3afb701020da376ff70fc927654', '[\"*\"]', NULL, '2024-08-09 15:40:25', '2024-08-09 15:40:25'),
(237, 'App\\Models\\User', 51, 'main', 'f40942c9cb6a1cd047bdd16dc2ccb69142fc6ee4f18a69a928c261dfd4f9a0a2', '[\"*\"]', NULL, '2024-08-09 15:41:40', '2024-08-09 15:41:40'),
(238, 'App\\Models\\User', 51, 'main', '8d94b86c68fb4e889134656953285129c9509d106f0539dfdb5c9a8dfea27685', '[\"*\"]', NULL, '2024-08-09 15:48:19', '2024-08-09 15:48:19'),
(239, 'App\\Models\\User', 51, 'main', 'fb3ba7c7dd88f863d0010eaf7764743dd78827bdff4c33b2102d9bd3d8eee4a9', '[\"*\"]', NULL, '2024-08-09 15:49:07', '2024-08-09 15:49:07'),
(240, 'App\\Models\\User', 51, 'main', 'f660bd2079a481359192ea850bc7f04b4d022f24dd138a62eee55427cb808f3a', '[\"*\"]', NULL, '2024-08-12 10:16:09', '2024-08-12 10:16:09'),
(241, 'App\\Models\\User', 51, 'main', 'f753223808ef28dc3ddf856f0892f8c994ff35b1e98df1c83fcdb71e5f4e5514', '[\"*\"]', NULL, '2024-08-12 10:19:08', '2024-08-12 10:19:08'),
(242, 'App\\Models\\User', 51, 'main', 'cd1d6f3061b5a07e57a814945aaba9a07b39afe1a47ddc3cfd3c8e0aa96141e9', '[\"*\"]', NULL, '2024-08-12 10:20:32', '2024-08-12 10:20:32'),
(243, 'App\\Models\\User', 51, 'main', 'b35e33e8e89a985d435ad29b615f7d07aa930da066969c1d576724d14843e7d7', '[\"*\"]', NULL, '2024-08-12 10:22:56', '2024-08-12 10:22:56'),
(244, 'App\\Models\\User', 51, 'main', '15a7a2dcf8ecf33169d05525f346a4e6c112674b01b7d519a028ebdccd23e583', '[\"*\"]', NULL, '2024-08-12 10:25:07', '2024-08-12 10:25:07'),
(245, 'App\\Models\\User', 51, 'main', '39f589cb77c840035e6d8807576af12faf5ee9b5cc6dc261178b5413f159c919', '[\"*\"]', NULL, '2024-08-12 10:28:55', '2024-08-12 10:28:55'),
(246, 'App\\Models\\User', 51, 'main', '0ade7014935e0a1d2aa1503a4c184537a8abd15caf7324b50a433ea086aa016d', '[\"*\"]', NULL, '2024-08-12 10:49:23', '2024-08-12 10:49:23'),
(247, 'App\\Models\\User', 51, 'main', '70a264446cfdf8dbfab66e6f416491f477e822af1ff71f6795d9f1b93b80a8b9', '[\"*\"]', NULL, '2024-08-12 10:49:42', '2024-08-12 10:49:42'),
(248, 'App\\Models\\User', 51, 'main', '21099687f05effe0f7877f81846c50b903727bb76604d306e1ecfcae706d0bc8', '[\"*\"]', NULL, '2024-08-12 11:03:46', '2024-08-12 11:03:46'),
(249, 'App\\Models\\User', 51, 'main', '79867514860cefcca994996234d0a16340a04dbb1503b1bee071d40082e28fb8', '[\"*\"]', NULL, '2024-08-12 11:12:41', '2024-08-12 11:12:41'),
(250, 'App\\Models\\User', 51, 'main', '8da5c37b850b219fa68beaf082c466b902ca131ed98223b81b79442bf9354418', '[\"*\"]', NULL, '2024-08-12 12:38:32', '2024-08-12 12:38:32'),
(251, 'App\\Models\\User', 51, 'main', 'cd1f77dee96e7acad64e0fac900bc893563a0e731f10a64de592aebf4ee506ae', '[\"*\"]', NULL, '2024-08-12 12:44:50', '2024-08-12 12:44:50'),
(252, 'App\\Models\\User', 51, 'main', 'd1c35ed3dc0c68e81cec2311039a7c981a3583273df9bb0b6cf5c97ff9809f9d', '[\"*\"]', NULL, '2024-08-12 12:55:11', '2024-08-12 12:55:11'),
(253, 'App\\Models\\User', 51, 'main', '64171faf8e5c38702b0df4da23e126fa8c999c2646c92deedef10c0091c340e4', '[\"*\"]', NULL, '2024-08-12 13:01:31', '2024-08-12 13:01:31'),
(254, 'App\\Models\\User', 51, 'main', '1d05cafedd45d40a2e978e726a4e42fa3910620f657d361fbc73d0cb6b1b47b4', '[\"*\"]', NULL, '2024-08-12 13:03:08', '2024-08-12 13:03:08'),
(255, 'App\\Models\\User', 51, 'main', '6744831157cba8ad2a8e00f488006ba573cc6b798b68e0d9fa0f06753219a721', '[\"*\"]', NULL, '2024-08-12 13:06:17', '2024-08-12 13:06:17'),
(256, 'App\\Models\\User', 51, 'main', '1db5dbf346a1e46b0e9ef80a6b4588b2df6bcff6be69c4544f50d38c3e9a3e8a', '[\"*\"]', NULL, '2024-08-12 13:16:44', '2024-08-12 13:16:44'),
(257, 'App\\Models\\User', 51, 'main', '4b899ea5f287c5e1cb637ec84fbad304c8b40ba482aec52a2f4ef3d4c6810879', '[\"*\"]', NULL, '2024-08-12 13:26:07', '2024-08-12 13:26:07'),
(258, 'App\\Models\\User', 51, 'main', '1268078ee40e638e9a4dacf88a9fd36938063293bb23d568a4a4d25f511fde4f', '[\"*\"]', NULL, '2024-08-12 13:31:26', '2024-08-12 13:31:26'),
(259, 'App\\Models\\User', 51, 'main', '4d0b22623a427fe335e268899b52ed71f2f83215191799ea926cc6924840577d', '[\"*\"]', NULL, '2024-08-12 13:34:56', '2024-08-12 13:34:56'),
(260, 'App\\Models\\User', 51, 'main', '7ab99e75031aab10e7b4e840e35a877af7c21938455ba31b1f7e50e5ce97eb1c', '[\"*\"]', NULL, '2024-08-12 13:40:50', '2024-08-12 13:40:50'),
(261, 'App\\Models\\User', 51, 'main', '5e979b2877f67942e546430790e47b1b05719d665e942f32ad368eb6f2c51e60', '[\"*\"]', NULL, '2024-08-12 14:04:24', '2024-08-12 14:04:24'),
(262, 'App\\Models\\User', 51, 'main', '6ffdcd5129244e5f7e5cc43dc30f6ff69325d63c714f7333f3608d58b62a00de', '[\"*\"]', NULL, '2024-08-12 14:51:11', '2024-08-12 14:51:11'),
(263, 'App\\Models\\User', 51, 'main', '709a7f04be5dd93f3104ce4c2f11a9b057eb13ba1fdd18ad4842d74f5b63cef9', '[\"*\"]', NULL, '2024-08-13 09:37:27', '2024-08-13 09:37:27'),
(264, 'App\\Models\\User', 51, 'main', 'a85b9e1e75886657ca8d7f87d9d1eb56654a42ead48a4b1e1db079333408a416', '[\"*\"]', NULL, '2024-08-14 13:15:31', '2024-08-14 13:15:31'),
(265, 'App\\Models\\User', 51, 'main', 'b468b1e4d89fbc7e550ebce49374119682674fb786747f4b3e77adf3eb5d0afc', '[\"*\"]', NULL, '2024-08-14 13:52:26', '2024-08-14 13:52:26'),
(266, 'App\\Models\\User', 51, 'main', '638e9d3bc6048791161d3565c8dc5c0e1af0a15c8efed621fe8bc5d227d47781', '[\"*\"]', NULL, '2024-08-14 14:06:46', '2024-08-14 14:06:46'),
(267, 'App\\Models\\User', 51, 'main', '3b1db415019b2d7da34423a9fbfad22c19c18f84c11e90cbc41d6c4388314c9c', '[\"*\"]', NULL, '2024-08-14 14:13:18', '2024-08-14 14:13:18'),
(268, 'App\\Models\\User', 51, 'main', '7a3b1f8b2b1284da6e3e4df5cdcf78812508e873d00dfbb94c577ac1d829573c', '[\"*\"]', NULL, '2024-08-14 14:16:05', '2024-08-14 14:16:05'),
(269, 'App\\Models\\User', 51, 'main', 'd4fd9283c896b0e940a9e22ffd3f77f4ddb7c8ccdd9355133056138032d6a8fb', '[\"*\"]', NULL, '2024-08-14 14:48:20', '2024-08-14 14:48:20'),
(270, 'App\\Models\\User', 51, 'main', 'd830df5dba0837d41d83ef3d35d9b2fb3112609029f55c57103b19395a5f8a4a', '[\"*\"]', NULL, '2024-08-16 09:42:26', '2024-08-16 09:42:26'),
(271, 'App\\Models\\User', 51, 'main', 'fdae1f8052313163984e0b87370db76ada53c903304893e86b528453b8ccc010', '[\"*\"]', NULL, '2024-08-20 08:26:45', '2024-08-20 08:26:45'),
(272, 'App\\Models\\User', 51, 'main', '19988077d16022d6006b181b74def05b65d76ff02481468e62b9ace89d338631', '[\"*\"]', NULL, '2024-08-20 08:38:31', '2024-08-20 08:38:31'),
(273, 'App\\Models\\User', 51, 'main', 'ff3a220e6e3e9a7b155f917f1e2f23b3580f04d18c6a5bd3e226bc877836a3d3', '[\"*\"]', NULL, '2024-08-20 14:21:12', '2024-08-20 14:21:12'),
(274, 'App\\Models\\User', 51, 'main', 'c184832d088e6334aea5a50240e58dfc648924316567529bc6c646869cad307f', '[\"*\"]', NULL, '2024-08-20 14:22:50', '2024-08-20 14:22:50'),
(275, 'App\\Models\\User', 51, 'main', '27fd74de01ebaeaf8b0deaebfe3365f80d04c98802a6885bc0575d959dce7c07', '[\"*\"]', NULL, '2024-08-20 14:50:34', '2024-08-20 14:50:34'),
(276, 'App\\Models\\User', 51, 'main', '7e9578afe54dd8f9000743b88c05e7ca4ff66e31f69c1aed009b60fd4a86eb8b', '[\"*\"]', NULL, '2024-08-22 09:14:29', '2024-08-22 09:14:29'),
(277, 'App\\Models\\User', 51, 'main', '28d506ced987c7817a7334624768f2056e55cd3533954d24f6bc65cf1ef65290', '[\"*\"]', NULL, '2024-09-02 12:17:09', '2024-09-02 12:17:09'),
(278, 'App\\Models\\User', 51, 'main', 'da6e5529f5d2b2adedeca25d7c376ee245d8ff489acbf0a85ace7bc32a8b1609', '[\"*\"]', NULL, '2024-09-02 12:53:42', '2024-09-02 12:53:42'),
(279, 'App\\Models\\User', 51, 'main', '783ef4b1046557f6cf23ab1c6de3e058fd8eae521632b5b535cf9d9335cdc67f', '[\"*\"]', NULL, '2024-09-02 13:07:48', '2024-09-02 13:07:48'),
(280, 'App\\Models\\User', 51, 'main', 'd3dcf1da13f0c6e6439c8dbdc9b785db1af8acddcfa154e08072711190b0f67d', '[\"*\"]', NULL, '2024-09-02 13:14:46', '2024-09-02 13:14:46'),
(281, 'App\\Models\\User', 51, 'main', '0692a4de88e0c8c8cc7ddaf1e7cf06499e5f4f39758bd39bef38b33dcb7547d5', '[\"*\"]', NULL, '2024-09-02 13:15:56', '2024-09-02 13:15:56'),
(282, 'App\\Models\\User', 51, 'main', '99b6fecf280a069f35885af59321a6dcf24249936e9996929974e6452ea6c9a8', '[\"*\"]', NULL, '2024-09-02 13:18:30', '2024-09-02 13:18:30'),
(283, 'App\\Models\\User', 51, 'main', '9e0f9f0552a235e4409d6c604e43d57cf079f3d5799e9b2d87ba74b2bae603bf', '[\"*\"]', NULL, '2024-09-02 13:23:05', '2024-09-02 13:23:05'),
(284, 'App\\Models\\User', 51, 'main', '22e31b9584393e0b4199c61b739a92bd801b4f955f4be077314fedbdd82bb1f4', '[\"*\"]', NULL, '2024-09-03 07:18:20', '2024-09-03 07:18:20'),
(285, 'App\\Models\\User', 51, 'main', '0fdc4f3b418f800c473cfa6398b5e3599ed51d65e301ed13a4a2fe71d165f3b0', '[\"*\"]', NULL, '2024-09-03 07:31:32', '2024-09-03 07:31:32'),
(286, 'App\\Models\\User', 51, 'main', '3d1a0cbd179b259b32625eb3054e7e8c614d0fda45512a858b2f73eeead2dd46', '[\"*\"]', NULL, '2024-09-03 08:57:15', '2024-09-03 08:57:15'),
(287, 'App\\Models\\User', 51, 'main', '8114c55320305113396966fe8528ff168ba88de8b14c1063b1631f78ff524877', '[\"*\"]', NULL, '2024-09-03 09:04:44', '2024-09-03 09:04:44'),
(288, 'App\\Models\\User', 51, 'main', '915e349380441a70ae03afe6b4363b088225c96f1d53a06d279bf19940f023cf', '[\"*\"]', NULL, '2024-09-04 10:54:59', '2024-09-04 10:54:59'),
(289, 'App\\Models\\User', 51, 'main', '33bfa83460dd62d216d8fbd4cc58498bace9aa137649a8f4e12d40cf97d09585', '[\"*\"]', NULL, '2024-09-04 11:02:07', '2024-09-04 11:02:07'),
(290, 'App\\Models\\User', 51, 'main', '20ed92f19be7d3f966dda2879e4c24ad548aebece1135ffc745ca65f468599a7', '[\"*\"]', NULL, '2024-09-04 11:02:41', '2024-09-04 11:02:41'),
(291, 'App\\Models\\User', 51, 'main', '18c08b5b30b4e8c6b22107f7af1b60fc0f5e40ef42ca03619b6c00a4761755b6', '[\"*\"]', NULL, '2024-09-04 11:04:13', '2024-09-04 11:04:13'),
(292, 'App\\Models\\User', 51, 'main', 'be68a76acd7b67584df215a66137f8305e586ec2d94659f67c1d33e1b947e96e', '[\"*\"]', NULL, '2024-09-04 11:04:53', '2024-09-04 11:04:53'),
(293, 'App\\Models\\User', 51, 'main', '19e1fd644179974db2140bce3f448c736fa0fcf8d50011fb2bf3c2c6d166bcf0', '[\"*\"]', NULL, '2024-09-04 11:06:35', '2024-09-04 11:06:35'),
(294, 'App\\Models\\User', 51, 'main', '1ae1838420227571cf920a6b706e23fc719d5a967022de6dce422e32029743ac', '[\"*\"]', NULL, '2024-09-04 11:07:49', '2024-09-04 11:07:49'),
(295, 'App\\Models\\User', 51, 'main', '717389d052a5785cc0a3b975d3d92886e6aae15b6b6427501ec891a8a6274e51', '[\"*\"]', NULL, '2024-09-04 11:09:28', '2024-09-04 11:09:28');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `created_at`, `updated_at`) VALUES
(296, 'App\\Models\\User', 51, 'main', '70776e070adb3ed0f6feebc9c98535b244675653969b04af086ca7c3c67b3909', '[\"*\"]', NULL, '2024-09-04 12:29:20', '2024-09-04 12:29:20'),
(297, 'App\\Models\\User', 51, 'main', '1b7355cc032e3894eeebbe12f58aa74265c2c43d1cf5b5efcf497e398b9833a4', '[\"*\"]', NULL, '2024-09-04 12:29:54', '2024-09-04 12:29:54'),
(298, 'App\\Models\\User', 51, 'main', '4588a4d460f529e4cea53dabdde9d5e425e4f024a03c73d91ed14f4fcebe2c60', '[\"*\"]', NULL, '2024-09-04 12:38:31', '2024-09-04 12:38:31'),
(299, 'App\\Models\\User', 51, 'main', '8a9a4239245956ca79f9883bc4d04aa3fdf6901af84a2fd8ccb7c2f5e38f1447', '[\"*\"]', NULL, '2024-09-04 12:39:36', '2024-09-04 12:39:36'),
(300, 'App\\Models\\User', 51, 'main', 'bab5bffb245d19ce37136e56678ec1a18a1d3bacf8462b72ed3a0c1dfe9cda78', '[\"*\"]', NULL, '2024-09-04 12:40:32', '2024-09-04 12:40:32'),
(301, 'App\\Models\\User', 51, 'main', '8473df0d8a7cd7140dd9a388262bf32396035ba85da23eeb9f4c474713482018', '[\"*\"]', NULL, '2024-09-04 12:43:30', '2024-09-04 12:43:30'),
(302, 'App\\Models\\User', 51, 'main', '4a75eaa751c5d0eddd6ed354a0e4e370280afd8cd673acdba687488af1ba4d0b', '[\"*\"]', NULL, '2024-09-04 12:43:57', '2024-09-04 12:43:57'),
(303, 'App\\Models\\User', 51, 'main', 'fd9412391687ea1d27f45581ec0f90529bb6b4532c571e6f3358557e579f61dc', '[\"*\"]', NULL, '2024-09-04 13:03:46', '2024-09-04 13:03:46'),
(304, 'App\\Models\\User', 51, 'main', 'af6163026c8947b440c16db3fd5af7f88e2e2de65afd5dd69e9f8c23f08c498e', '[\"*\"]', NULL, '2024-09-04 13:31:21', '2024-09-04 13:31:21'),
(305, 'App\\Models\\User', 51, 'main', 'ebc234048b646ec1f90e5cd0853d8ec0e98c39e2b1f1e6287417e2bc4f780b1a', '[\"*\"]', NULL, '2024-09-04 13:34:36', '2024-09-04 13:34:36'),
(306, 'App\\Models\\User', 51, 'main', '110af43a994393138b74b323784455c7348a17e962fa226ec75ede008d75d61c', '[\"*\"]', NULL, '2024-09-04 13:44:21', '2024-09-04 13:44:21'),
(307, 'App\\Models\\User', 51, 'main', '0dc95d7af6c2e02fe58bbd60f17c6e2fa64cecd8a6e418cc1b1b1d1524fcaec7', '[\"*\"]', NULL, '2024-09-04 13:45:09', '2024-09-04 13:45:09'),
(308, 'App\\Models\\User', 51, 'main', '0a13099b23bcaa1299f647787819e22016e606452c293c31f1c0c38589527001', '[\"*\"]', NULL, '2024-09-04 13:45:51', '2024-09-04 13:45:51'),
(309, 'App\\Models\\User', 51, 'main', '6ea5ce16494bd3f2d5b390502867a8771edcf6a202f0a3af05c6b49d715cd2c1', '[\"*\"]', NULL, '2024-09-04 13:46:24', '2024-09-04 13:46:24'),
(310, 'App\\Models\\User', 51, 'main', 'b0f72a948584b5424accdc7217defeea11a7fa14953d882a600e6ffb210cbb85', '[\"*\"]', NULL, '2024-09-04 13:50:37', '2024-09-04 13:50:37'),
(311, 'App\\Models\\User', 51, 'main', 'd6744b40471933aeb29714520e775c151e14cc3919bf93071a0df45aa92cec1c', '[\"*\"]', NULL, '2024-09-04 13:52:52', '2024-09-04 13:52:52'),
(312, 'App\\Models\\User', 51, 'main', '644da953a6c735a3ef0ad6b7808adc3d4c1b3a7151950cd3aec6826077942090', '[\"*\"]', NULL, '2024-09-04 13:53:28', '2024-09-04 13:53:28'),
(313, 'App\\Models\\User', 51, 'main', '19cb9e581383dc843a69916fd06e1ab86ddbc75a36e386f8c3b9dc4aa8c8a197', '[\"*\"]', NULL, '2024-09-04 13:53:54', '2024-09-04 13:53:54'),
(314, 'App\\Models\\User', 51, 'main', '2fb642256dc87aa0e2bef54cc1c2864c9c0dc9aefaacd1d01a8db1bcf1d9bd69', '[\"*\"]', NULL, '2024-09-04 13:55:49', '2024-09-04 13:55:49'),
(315, 'App\\Models\\User', 51, 'main', 'b3a499f829c4a4a279772144c20df9cc5666ea5213c6009f36cb433259b21a32', '[\"*\"]', NULL, '2024-09-04 13:58:48', '2024-09-04 13:58:48'),
(316, 'App\\Models\\User', 51, 'main', '1d48c821a29391b44bc81d43779b0e7ce9cd2fdb0b801c1591c504e2e3d20d4c', '[\"*\"]', NULL, '2024-09-05 07:38:07', '2024-09-05 07:38:07'),
(317, 'App\\Models\\User', 51, 'main', '6dc5962e8c18c479b425d9a7c55d7c05d713c0a508174d89a55fa79c1b8c5d69', '[\"*\"]', NULL, '2024-09-05 07:41:51', '2024-09-05 07:41:51'),
(318, 'App\\Models\\User', 51, 'main', '58c8e26ea9a08ecfcbb63c71f07b67a66036bdd1f07ed6cba1d89236da6a56d1', '[\"*\"]', NULL, '2024-09-05 07:56:00', '2024-09-05 07:56:00'),
(319, 'App\\Models\\User', 51, 'main', '62c4085fd5f04fe98ea438e8e92c02d9f93c81dbd53891857f6ea334fd9cec23', '[\"*\"]', NULL, '2024-09-05 07:57:41', '2024-09-05 07:57:41'),
(320, 'App\\Models\\User', 51, 'main', '09e088bc41985651a4609264545834f07ada3b7259dc6a19c5fea8b9f7932af0', '[\"*\"]', NULL, '2024-09-05 07:59:30', '2024-09-05 07:59:30'),
(321, 'App\\Models\\User', 51, 'main', '4cb315a6f4c48f6d52404008e629c8816d1f4461ef7df12dd55a1324aa1f04d1', '[\"*\"]', NULL, '2024-09-05 08:02:26', '2024-09-05 08:02:26'),
(322, 'App\\Models\\User', 51, 'main', '01538ac2ea23b9eb961b32ff85e2c41399b0f645c1bc38ccbc2f9afbaa7d831c', '[\"*\"]', NULL, '2024-09-05 08:03:30', '2024-09-05 08:03:30'),
(323, 'App\\Models\\User', 51, 'main', '28cd0078954746ca389b55daf73bb26d6d13979d76694ba7fc0348115a74711e', '[\"*\"]', NULL, '2024-09-05 08:07:31', '2024-09-05 08:07:31'),
(324, 'App\\Models\\User', 51, 'main', '313b2f96716b731c3de133ed550eeaa535df1fb2b0a71c2bbf64b1a8a9585ce4', '[\"*\"]', NULL, '2024-09-05 08:14:01', '2024-09-05 08:14:01'),
(325, 'App\\Models\\User', 51, 'main', '59efcdce2ec62605d2367c609dfe143169f7fbe6ce380ff27705cf8bde3dda6e', '[\"*\"]', NULL, '2024-09-05 13:40:54', '2024-09-05 13:40:54'),
(326, 'App\\Models\\User', 51, 'main', 'da186a54cef94b3332c5438e0b12e4cd668cee716ca4cdcba8babc50c9505b14', '[\"*\"]', NULL, '2024-09-05 14:09:00', '2024-09-05 14:09:00'),
(327, 'App\\Models\\User', 51, 'main', 'c299d568ff6d70963a7a994d8cf5ef23ef21aab46a718c46b77ddf0c69938873', '[\"*\"]', NULL, '2024-09-05 14:10:19', '2024-09-05 14:10:19'),
(328, 'App\\Models\\User', 51, 'main', '7eb38b1ba7fd940818f0df338314f8d2a9c134f2cfb7d69cca7b769406294a3b', '[\"*\"]', NULL, '2024-09-05 14:12:53', '2024-09-05 14:12:53'),
(329, 'App\\Models\\User', 51, 'main', 'ae877dd603537497c41d485667d8b125c6ea66ab6bc5f9e2fcc01e84db4b46a6', '[\"*\"]', NULL, '2024-09-05 14:18:33', '2024-09-05 14:18:33'),
(330, 'App\\Models\\User', 51, 'main', 'e7f4a38cd21ff8507839968d112aa385a1f14e96921e1c5e9df6a4c670a1c344', '[\"*\"]', NULL, '2024-09-05 14:24:19', '2024-09-05 14:24:19'),
(331, 'App\\Models\\User', 51, 'main', 'f0def2801fa8957b6b0966db51ab70c29c0ddce01b069426304c7f425fbf1aa7', '[\"*\"]', NULL, '2024-09-05 14:27:17', '2024-09-05 14:27:17'),
(332, 'App\\Models\\User', 51, 'main', '400cba4f974fd6480683dd6e8bf2b22a3e303f0f9ab306ff1f6514d15961ad9a', '[\"*\"]', NULL, '2024-09-05 14:30:10', '2024-09-05 14:30:10'),
(333, 'App\\Models\\User', 51, 'main', 'fcbd2883a2ea383f8f99bcd1af254221ac2b309f83f66e7248e94aec4a566311', '[\"*\"]', NULL, '2024-09-05 14:32:33', '2024-09-05 14:32:33'),
(334, 'App\\Models\\User', 51, 'main', '64f5207e933fde4035b9cd0d032c30972ad4823f5337a6cb05c9620ab8aa2fcd', '[\"*\"]', NULL, '2024-09-05 14:34:57', '2024-09-05 14:34:57'),
(335, 'App\\Models\\User', 51, 'main', '29869ba0e0061c75aeed625867a3dfb51cafb129371a51a9a64ee195949405e6', '[\"*\"]', NULL, '2024-09-05 14:40:20', '2024-09-05 14:40:20'),
(336, 'App\\Models\\User', 51, 'main', '49dfd0018202486f0c1a103a53477599664843de8095e2346b0902cdac28409b', '[\"*\"]', NULL, '2024-09-05 14:47:12', '2024-09-05 14:47:12'),
(337, 'App\\Models\\User', 51, 'main', 'da96efef0fb3200c0c4929354e643de468bd82a67d0cf5a347a17f3d3b1b2cfc', '[\"*\"]', NULL, '2024-09-05 14:59:38', '2024-09-05 14:59:38'),
(338, 'App\\Models\\User', 51, 'main', '6b69d1f75575ef6753938eac9f53dc25bbe0655d66740c12031c1694ae0a936a', '[\"*\"]', NULL, '2024-09-05 15:02:03', '2024-09-05 15:02:03'),
(339, 'App\\Models\\User', 51, 'main', 'ae3ec5b62479219a5c7b0ae241f0347e78fe5f759314ecf3a1bd8fa0c3b3534e', '[\"*\"]', NULL, '2024-09-05 15:03:31', '2024-09-05 15:03:31'),
(340, 'App\\Models\\User', 51, 'main', 'accfd408d81680f23a975a8870df0f3e5598a5fda032b4466a211f1ab9628be3', '[\"*\"]', NULL, '2024-09-05 15:06:46', '2024-09-05 15:06:46'),
(341, 'App\\Models\\User', 51, 'main', '418041e5be5041831289a56929e50f81e3d5dcf5b50f21ad6d0921b29034ece4', '[\"*\"]', NULL, '2024-09-05 15:08:55', '2024-09-05 15:08:55'),
(342, 'App\\Models\\User', 51, 'main', '4d4211b28ab7215a43ddd8e3d1d17e578a5c462f2df1056fdb70f385f9d5befd', '[\"*\"]', NULL, '2024-09-05 15:14:48', '2024-09-05 15:14:48'),
(343, 'App\\Models\\User', 51, 'main', 'fced3b4a2b9a5454ca9adcdf4149fb139b08549b78c5b32a1532f80c2bdaaa7a', '[\"*\"]', NULL, '2024-09-06 07:47:25', '2024-09-06 07:47:25'),
(344, 'App\\Models\\User', 51, 'main', 'aa7df6ac34268b80028f9c076cfbc47823ef46de06753d654dac4927dbef8b46', '[\"*\"]', NULL, '2024-09-06 07:49:13', '2024-09-06 07:49:13'),
(345, 'App\\Models\\User', 51, 'main', '8e91ad86fee2e069f8e59c4134f854ee84197b8a64b55fc9cd00e99b32ce98b2', '[\"*\"]', NULL, '2024-09-06 09:34:15', '2024-09-06 09:34:15'),
(346, 'App\\Models\\User', 51, 'main', 'f6a73e0fcdb5f1272596dd90996be69bb2a200d02d477bc04e170879ad45b37a', '[\"*\"]', NULL, '2024-09-06 09:38:09', '2024-09-06 09:38:09'),
(347, 'App\\Models\\User', 51, 'main', 'de46ec9235fbee28004a53cc57b9a53971e6af12b37a4ff429fd9fab23d23721', '[\"*\"]', NULL, '2024-09-06 09:40:03', '2024-09-06 09:40:03'),
(348, 'App\\Models\\User', 51, 'main', '227b006fb16f17494998621fe33399ef4a5326b97f8800457cf285ce9a6cb728', '[\"*\"]', NULL, '2024-09-06 09:45:17', '2024-09-06 09:45:17'),
(349, 'App\\Models\\User', 51, 'main', '4773380704b5c8fba5cb7d114fc2d89a3801dc00e9ddb77b27a46c960fbb107e', '[\"*\"]', NULL, '2024-09-06 09:56:26', '2024-09-06 09:56:26'),
(350, 'App\\Models\\User', 51, 'main', '5d0d25ba6f9eb4ae2d8d5365ebec785ee69700b994a937d1c6751447927965ca', '[\"*\"]', NULL, '2024-09-06 09:58:23', '2024-09-06 09:58:23'),
(351, 'App\\Models\\User', 51, 'main', 'b1270e74eaca714398da06b67ae2228f41764a07662207fc207f839d7cd5b586', '[\"*\"]', NULL, '2024-09-06 10:01:57', '2024-09-06 10:01:57'),
(352, 'App\\Models\\User', 51, 'main', '103b999855bb8007fc84dbfda1e462f8ca372ac04028252486a5349c9ac2374c', '[\"*\"]', NULL, '2024-09-06 10:04:40', '2024-09-06 10:04:40'),
(353, 'App\\Models\\User', 51, 'main', 'b82e8ad047e278ed4e94a61b815021619cf780300b9381a0c708af66139dbf99', '[\"*\"]', NULL, '2024-09-06 10:06:48', '2024-09-06 10:06:48'),
(354, 'App\\Models\\User', 51, 'main', 'e56d2614db327cd89c32389a04a8fb05ae3a6467833c599ca9125142544648c9', '[\"*\"]', NULL, '2024-09-06 10:07:26', '2024-09-06 10:07:26'),
(355, 'App\\Models\\User', 51, 'main', '266b121a0deea805699c2d51f106ef4ff2d753a8772699f8bd9b8e35c8889141', '[\"*\"]', NULL, '2024-09-06 10:33:23', '2024-09-06 10:33:23'),
(356, 'App\\Models\\User', 51, 'main', 'ee605eed5c83c35c821105b5c77e6553d7301630ff2e67289569dac85bef10b0', '[\"*\"]', NULL, '2024-09-06 10:46:36', '2024-09-06 10:46:36'),
(357, 'App\\Models\\User', 51, 'main', '02ad102d35edfdb655e5e1f568ebcb107289238beb2f2922459bc4aa31259ebc', '[\"*\"]', NULL, '2024-09-06 13:00:42', '2024-09-06 13:00:42'),
(358, 'App\\Models\\User', 51, 'main', '7c4180fcbc8432a7ef7fe99d1b8442ecea01018bfc6d88ebb557343e07fca603', '[\"*\"]', NULL, '2024-09-06 13:02:20', '2024-09-06 13:02:20'),
(359, 'App\\Models\\User', 51, 'main', 'fb6d430b9e09942cbb5bf7f9527859880b44b8f1adafa1728bfc12b6e8bdd070', '[\"*\"]', NULL, '2024-09-06 13:08:36', '2024-09-06 13:08:36'),
(360, 'App\\Models\\User', 51, 'main', '5e1a19ffe85adf0b68fa5671f306fe7e10924c81f101536d1f0f8f2f6546655e', '[\"*\"]', NULL, '2024-09-06 13:17:26', '2024-09-06 13:17:26'),
(361, 'App\\Models\\User', 51, 'main', '02a227dd327544cb482abee765fc1381ef3b11a5c5e99107512bfb4981da874a', '[\"*\"]', NULL, '2024-09-06 13:28:22', '2024-09-06 13:28:22'),
(362, 'App\\Models\\User', 51, 'main', '38bda0bebbc8f6b5dae26275c457a60c51e026dfe7689295cc60c252a2ead251', '[\"*\"]', NULL, '2024-09-06 13:35:26', '2024-09-06 13:35:26'),
(363, 'App\\Models\\User', 51, 'main', 'd3a12853e45ce1c21a4a28053a3962f2ec423d0e46e30d06463deeac55eb9d65', '[\"*\"]', NULL, '2024-09-06 13:36:42', '2024-09-06 13:36:42'),
(364, 'App\\Models\\User', 51, 'main', 'ab6c1e6d1c2c659a595fe5310a6206c4567a6eabc22d056f7ddc326214178c73', '[\"*\"]', NULL, '2024-09-06 13:37:07', '2024-09-06 13:37:07'),
(365, 'App\\Models\\User', 51, 'main', '71e61dda63958c0d133f5883e139c05d026ed220a471facff2ccf74a704bf6a1', '[\"*\"]', NULL, '2024-09-06 13:38:07', '2024-09-06 13:38:07'),
(366, 'App\\Models\\User', 51, 'main', '68c55107c37eff5362800c0cf3598349515c5f9a9934170eba8f629620c39107', '[\"*\"]', NULL, '2024-09-06 13:39:45', '2024-09-06 13:39:45'),
(367, 'App\\Models\\User', 51, 'main', 'c408a2a2ac7daa3e343a37476e061687a68c1e892b37009efaa3f4e5115d7872', '[\"*\"]', NULL, '2024-09-06 13:44:14', '2024-09-06 13:44:14'),
(368, 'App\\Models\\User', 51, 'main', '3685c5f1b3f570998947233c44843d16a4c417f47a0e6ebfdb7ba4a7dbd283b1', '[\"*\"]', NULL, '2024-09-06 13:46:46', '2024-09-06 13:46:46'),
(369, 'App\\Models\\User', 51, 'main', '0b7f2aa02c3845af795404727be5548a71eae9e9d418e11ba7fde6af7c1e85be', '[\"*\"]', NULL, '2024-09-06 13:50:58', '2024-09-06 13:50:58'),
(370, 'App\\Models\\User', 51, 'main', '8dcabf91e6f1716436520eef4df00ade592c60bbc1a925c4077c79173ca7818d', '[\"*\"]', NULL, '2024-09-06 13:51:44', '2024-09-06 13:51:44'),
(371, 'App\\Models\\User', 51, 'main', '96f73c8461422a4c5a18f9f090a705667c69aa1e23ae0e00a7864192fbca2a92', '[\"*\"]', NULL, '2024-09-06 14:55:01', '2024-09-06 14:55:01'),
(372, 'App\\Models\\User', 51, 'main', '100b6121af310c2fc6b9a9269a6d3c31a5ceece2dc197c41b146d48b43491fc9', '[\"*\"]', NULL, '2024-09-10 14:02:15', '2024-09-10 14:02:15'),
(373, 'App\\Models\\User', 51, 'main', '7c576716bfdb1780f9654eb5431a46399af699b24225cb49b2f581ad1e49bc62', '[\"*\"]', NULL, '2024-09-11 07:04:59', '2024-09-11 07:04:59'),
(374, 'App\\Models\\User', 51, 'main', '6931eee266bbf10f3afff9ea9f01ac87a5025aa0f224615a7123af1dbeaa13c0', '[\"*\"]', NULL, '2024-09-11 07:17:51', '2024-09-11 07:17:51'),
(375, 'App\\Models\\User', 51, 'main', '637d6252eb98c0e5561dc2ac005b6e04a339e5ca0b54620de4f731ad2a6aa0cc', '[\"*\"]', NULL, '2024-09-11 07:26:35', '2024-09-11 07:26:35'),
(376, 'App\\Models\\User', 51, 'main', 'df0b203c9eaa9548b1168fb1e0f6d68457814e2ab5808bfe68df3be8fb5b2132', '[\"*\"]', NULL, '2024-09-11 07:28:42', '2024-09-11 07:28:42'),
(377, 'App\\Models\\User', 51, 'main', '3dfdb4532566c71d2d40f194769d9c24ece96ebda2b99eeb25759263fb2624a4', '[\"*\"]', NULL, '2024-09-11 07:51:48', '2024-09-11 07:51:48'),
(378, 'App\\Models\\User', 51, 'main', '4e8ae453b56b918411c32bd09906da6478d6080abd123777894a52874a91bb23', '[\"*\"]', NULL, '2024-09-11 07:58:00', '2024-09-11 07:58:00'),
(379, 'App\\Models\\User', 51, 'main', '9a51c2300856a561a57e9abb50e87e00d629909c4bcb178e0272576d527dac12', '[\"*\"]', NULL, '2024-09-11 08:31:29', '2024-09-11 08:31:29'),
(380, 'App\\Models\\User', 51, 'main', '9098ad90c39bd696b94f5582ab0fafb2713dd79e28313382ea6b5981bc5efee1', '[\"*\"]', NULL, '2024-09-11 08:34:14', '2024-09-11 08:34:14'),
(381, 'App\\Models\\User', 51, 'main', '669724922a3d48d5aebae1aaa4df34b3366cc584ba7570109ea51ccfb83dd8f7', '[\"*\"]', NULL, '2024-09-11 08:36:21', '2024-09-11 08:36:21'),
(382, 'App\\Models\\User', 51, 'main', '17807aa01b6505b497f6fd7a82851bb117e948a533de5b5ccd92942c1b5790f6', '[\"*\"]', NULL, '2024-09-11 08:40:00', '2024-09-11 08:40:00'),
(383, 'App\\Models\\User', 51, 'main', 'bf83e9a5270a2b853a09f652093e9b67cf319eb3625a1b9d438d42a82ac92775', '[\"*\"]', NULL, '2024-09-11 08:42:29', '2024-09-11 08:42:29'),
(384, 'App\\Models\\User', 51, 'main', '93b7b15dfa8d14d38cda73551504ae8c75cd5aea3d30407b8ae893d510869bbb', '[\"*\"]', NULL, '2024-09-11 08:58:54', '2024-09-11 08:58:54'),
(385, 'App\\Models\\User', 51, 'main', 'be29fc20414ae6825648156283c62ffce42bd9ed1513d96eb7bd8994bdea2768', '[\"*\"]', NULL, '2024-09-11 09:51:19', '2024-09-11 09:51:19'),
(386, 'App\\Models\\User', 51, 'main', '191f54d120e7ea2dffdee4e98d67015d708e2f415071f4222c6747d1de92f58e', '[\"*\"]', NULL, '2024-09-11 09:53:43', '2024-09-11 09:53:43'),
(387, 'App\\Models\\User', 51, 'main', 'bd08f982c4fab83b3366ca2136a5fc48ae7eadfccfaf0a3454481b5e869853d7', '[\"*\"]', NULL, '2024-09-11 09:55:24', '2024-09-11 09:55:24'),
(388, 'App\\Models\\User', 51, 'main', '4ca0cf37ed82143e482bda9b0bae73b6579f56b74a8a534a3175674080545f9c', '[\"*\"]', NULL, '2024-09-11 09:55:40', '2024-09-11 09:55:40'),
(389, 'App\\Models\\User', 51, 'main', '0ef39a0fb34c0c3cf051e1c07718cefbfeac69f205697c3643af496a221bb2b3', '[\"*\"]', NULL, '2024-09-11 11:44:54', '2024-09-11 11:44:54'),
(390, 'App\\Models\\User', 51, 'main', '8ed1a9ccceb5dfaccb7d8ce94138ef8b3c6ef6bb42fbd057d19412042034cd50', '[\"*\"]', NULL, '2024-09-11 11:53:17', '2024-09-11 11:53:17'),
(391, 'App\\Models\\User', 51, 'main', '383fad6bcf77ab4d7cd51123c6f8fde2528786db317b719ea56be8845f345d86', '[\"*\"]', NULL, '2024-09-11 11:55:40', '2024-09-11 11:55:40'),
(392, 'App\\Models\\User', 51, 'main', '50365ab491c54c6a141e0aa152c9f4d7ecb8b3e88878491d68f38bb36127419e', '[\"*\"]', NULL, '2024-09-11 11:57:37', '2024-09-11 11:57:37'),
(393, 'App\\Models\\User', 51, 'main', 'ed9e18768aaa411dab0ef192a3bdad05118d80d00279f8be8076fac5bd180116', '[\"*\"]', NULL, '2024-09-11 11:58:51', '2024-09-11 11:58:51'),
(394, 'App\\Models\\User', 51, 'main', 'd8d10a55e405933d23b1df56e9ebb07278599d814987f2618deeacaad53bce81', '[\"*\"]', NULL, '2024-09-11 11:59:31', '2024-09-11 11:59:31'),
(395, 'App\\Models\\User', 51, 'main', '25158f2509c55d04767aef8504850055bb28ecf94a33c020461d334990e23444', '[\"*\"]', NULL, '2024-09-11 12:04:37', '2024-09-11 12:04:37'),
(396, 'App\\Models\\User', 51, 'main', 'fc62665393ff3b976e2feeb6706f71ba8bf25bdaeeb431fbc8fbd884379e182f', '[\"*\"]', NULL, '2024-09-11 12:06:32', '2024-09-11 12:06:32'),
(397, 'App\\Models\\User', 51, 'main', '27147da8195b2f30328fb6dd6486c9e99f1379652776f9a46a4c232e0c69b888', '[\"*\"]', NULL, '2024-09-11 12:11:05', '2024-09-11 12:11:05'),
(398, 'App\\Models\\User', 51, 'main', '79f7d43c0b61a5ed03051f4531fb8206967e8b0ae7447df2e5f13b2247f44e43', '[\"*\"]', NULL, '2024-09-11 12:13:35', '2024-09-11 12:13:35'),
(399, 'App\\Models\\User', 51, 'main', 'a5f80eafc300bcbdb8de98b3339834d3a26c4c286c7f0dc43514d11409ef7e3d', '[\"*\"]', NULL, '2024-09-11 12:15:35', '2024-09-11 12:15:35'),
(400, 'App\\Models\\User', 51, 'main', '3987c9fcac285d226503ae45f0021a9d8857c6ac603738d0d120f93b82b23d4c', '[\"*\"]', NULL, '2024-09-16 09:07:47', '2024-09-16 09:07:47'),
(401, 'App\\Models\\User', 51, 'main', '4960534e5241d7467de138440fe86669e76b5e7d251f035acfaf4465eae1bc22', '[\"*\"]', NULL, '2024-09-16 09:12:50', '2024-09-16 09:12:50'),
(402, 'App\\Models\\User', 51, 'main', '6abe14a6cc56b84406cfaac9efeee538d7552b81470b223531b711f5410ae3b4', '[\"*\"]', NULL, '2024-09-16 09:13:49', '2024-09-16 09:13:49'),
(403, 'App\\Models\\User', 51, 'main', '8551afbba06b27b498b3a09988ddf8be830c9c7777e97b3c24ef0c95605025d1', '[\"*\"]', NULL, '2024-09-16 09:20:21', '2024-09-16 09:20:21'),
(404, 'App\\Models\\User', 51, 'main', '3ee848bcd450aaabf751ef051c1b63e0912dcce58c61682ecd9c453b21f4aba9', '[\"*\"]', NULL, '2024-09-16 09:21:35', '2024-09-16 09:21:35'),
(405, 'App\\Models\\User', 51, 'main', '497fc4b5eff2e3dec15174f4a744c3e62528743c671250b4fb3a4c1317968d34', '[\"*\"]', NULL, '2024-09-16 09:33:45', '2024-09-16 09:33:45'),
(406, 'App\\Models\\User', 51, 'main', 'edf85ed2650ed0b7c88dba3c59cababc6e35eb10ef28d793aeaea7cd665816b2', '[\"*\"]', NULL, '2024-09-16 09:35:09', '2024-09-16 09:35:09'),
(407, 'App\\Models\\User', 51, 'main', '598e0d68acbf0bf093ad7bb17d19410b95449f26e3d35fd182a4bb8bf1637c6b', '[\"*\"]', NULL, '2024-09-16 09:37:29', '2024-09-16 09:37:29'),
(408, 'App\\Models\\User', 51, 'main', '5136faf577c9f70fe593fb8a40df9984147db19e9339d2ed397d4850c48dc47b', '[\"*\"]', NULL, '2024-09-16 09:45:03', '2024-09-16 09:45:03'),
(409, 'App\\Models\\User', 51, 'main', '3bfe2b98f02d4efeac96a0595b446327973f0627020f7796c96167024d721f11', '[\"*\"]', NULL, '2024-09-16 09:46:21', '2024-09-16 09:46:21'),
(410, 'App\\Models\\User', 51, 'main', '0a7b5b37efe5ce45a84eedd23ff94ffccfef937fad2befc311f23868dd005013', '[\"*\"]', NULL, '2024-09-16 09:56:46', '2024-09-16 09:56:46'),
(411, 'App\\Models\\User', 51, 'main', '09136831d3a97fb77b82294ed8abe5569d9ba481241ff2b1343c9605f61305c9', '[\"*\"]', NULL, '2024-09-16 10:01:57', '2024-09-16 10:01:57'),
(412, 'App\\Models\\User', 51, 'main', '8501be62645e187c69f17e6504168f266954e33285c21b584e1ae0036699a9d3', '[\"*\"]', NULL, '2024-09-16 10:04:57', '2024-09-16 10:04:57'),
(413, 'App\\Models\\User', 51, 'main', '8adda0d3faf2c52c0618dfb50cdfb2fbda04acd9b294319d3df05705890e733a', '[\"*\"]', NULL, '2024-09-16 10:06:51', '2024-09-16 10:06:51'),
(414, 'App\\Models\\User', 51, 'main', '644fa9b3362debfd833bfac3ccca153ea2fcdfe345edb92e6dc88001e46c3464', '[\"*\"]', NULL, '2024-09-16 14:14:06', '2024-09-16 14:14:06'),
(415, 'App\\Models\\User', 51, 'main', 'c4ed975f01aadd64f066a1bb1ed60c7942b086a88bbd183fd66e2597832ff8fd', '[\"*\"]', NULL, '2024-09-16 14:43:10', '2024-09-16 14:43:10'),
(416, 'App\\Models\\User', 51, 'main', 'befbf7bfaa32944ca9a90415d32fa4c2a19efa25bc77c28815e4003bd6f285f5', '[\"*\"]', NULL, '2024-09-16 14:45:40', '2024-09-16 14:45:40'),
(417, 'App\\Models\\User', 51, 'main', '721b102ff3ca47cf276a84c0ffe1ed910ce52b6c45012b0f1851ed40097d6b63', '[\"*\"]', NULL, '2024-09-16 14:53:18', '2024-09-16 14:53:18'),
(418, 'App\\Models\\User', 51, 'main', '469425692959d7491d5ee8fe33bbdf5c8d3366c65cbb5c18932a99a05c98cbe3', '[\"*\"]', NULL, '2024-09-16 14:54:48', '2024-09-16 14:54:48'),
(419, 'App\\Models\\User', 51, 'main', '1795d1bf15acabbd80eb0e3a7103bf16980a694e7694ee5ed518e5728e0491f2', '[\"*\"]', NULL, '2024-09-16 14:56:03', '2024-09-16 14:56:03'),
(420, 'App\\Models\\User', 51, 'main', '28d696a67e0befa62206518c2194db48bff2b5ea1f51c45b2fe911d6d6ba2145', '[\"*\"]', NULL, '2024-09-16 14:59:22', '2024-09-16 14:59:22'),
(421, 'App\\Models\\User', 51, 'main', '72c335a036aa68d74f48dd3e9d58990a363b1036c0b991636ecca3cd69a5de33', '[\"*\"]', NULL, '2024-09-16 15:00:32', '2024-09-16 15:00:32'),
(422, 'App\\Models\\User', 51, 'main', '75a3f12fb3445a36611cd2b18345d7a7c0a883a3d07cde2c203bee155e7a4a7b', '[\"*\"]', NULL, '2024-09-16 15:02:31', '2024-09-16 15:02:31'),
(423, 'App\\Models\\User', 51, 'main', '2cbb65214771daf61e955167567e5c4e49462409752e6772c49b55b39011c747', '[\"*\"]', NULL, '2024-09-16 15:05:33', '2024-09-16 15:05:33'),
(424, 'App\\Models\\User', 51, 'main', '0d7d39b9b283d44e52807e8dc544fe4ca67cb17b385cffbb6cc427681700b86a', '[\"*\"]', NULL, '2024-09-16 15:07:57', '2024-09-16 15:07:57'),
(425, 'App\\Models\\User', 51, 'main', 'a6327c65aba44f6e3e0e9d5596a3de145c4cfe5cea0505e65617a4916020fb85', '[\"*\"]', NULL, '2024-09-17 06:30:47', '2024-09-17 06:30:47'),
(426, 'App\\Models\\User', 51, 'main', '6d43bae4e287e7e31f6f6622ab7e386d9db1e4426a4e15cc67001f148dd343b0', '[\"*\"]', NULL, '2024-09-17 07:44:47', '2024-09-17 07:44:47'),
(427, 'App\\Models\\User', 51, 'main', '30997ae2955d2507acd71fb15c9bc5582fc14237efdb11ba3a5d9af98c56a95d', '[\"*\"]', NULL, '2024-09-17 08:15:07', '2024-09-17 08:15:07'),
(428, 'App\\Models\\User', 51, 'main', '9643643e0d7003ad65c8a92339a75d7e9b040e5a5e9d8003aa759125bd9b4b2e', '[\"*\"]', NULL, '2024-09-17 08:31:03', '2024-09-17 08:31:03'),
(429, 'App\\Models\\User', 51, 'main', '7365c1ce8ea163c97b394379c793c731e785fcb84c87c0bdd67d8900a25cb020', '[\"*\"]', NULL, '2024-09-17 08:32:35', '2024-09-17 08:32:35'),
(430, 'App\\Models\\User', 51, 'main', 'c1bd0a296356cdddc090dd3d5a96d8822a2c9d6d2077822f46c0a92a37512df9', '[\"*\"]', NULL, '2024-09-17 09:30:52', '2024-09-17 09:30:52'),
(431, 'App\\Models\\User', 51, 'main', '8fb08cc4c33b5e858c9ec64ce73eef2571ac5f484a10ac3212cc3e8bf1a13982', '[\"*\"]', NULL, '2024-09-18 11:48:24', '2024-09-18 11:48:24'),
(432, 'App\\Models\\User', 51, 'main', '826ea4d928083fb14fee9d9cbbe50699c8de54f07590882501ed7a415efc4b06', '[\"*\"]', NULL, '2024-09-18 11:57:35', '2024-09-18 11:57:35'),
(433, 'App\\Models\\User', 51, 'main', '231e2681db0996ad15ac95cd7230f389b05bcdb040cbde3aa30fdab5d90e12bd', '[\"*\"]', NULL, '2024-09-19 08:58:29', '2024-09-19 08:58:29'),
(434, 'App\\Models\\User', 65, 'main', 'f8e94686802100c38679b89a363af593fabfe57a332c66cb624adef7913339ca', '[\"*\"]', NULL, '2024-09-19 09:46:11', '2024-09-19 09:46:11'),
(435, 'App\\Models\\User', 51, 'main', '039fa014226b74d08d9c196490c8fbda6cd74dd87a423b5ad83ed3857d7907df', '[\"*\"]', NULL, '2024-09-20 07:08:55', '2024-09-20 07:08:55'),
(436, 'App\\Models\\User', 51, 'main', '5175a8033cc8ca0bcd6ab6eff026fe8a0bc41105a72ce758f84416223b8b3152', '[\"*\"]', NULL, '2024-09-20 07:10:46', '2024-09-20 07:10:46'),
(437, 'App\\Models\\User', 51, 'main', '2080b6b2a7753581b429607f0e503c881a2e345c4551b6e154476b929337b175', '[\"*\"]', NULL, '2024-09-20 07:11:31', '2024-09-20 07:11:31'),
(438, 'App\\Models\\User', 51, 'main', 'ad4448226cadb681acb20f8bdcee1e68aa8434038e76941c6312621def0c7e89', '[\"*\"]', NULL, '2024-09-20 07:12:27', '2024-09-20 07:12:27'),
(439, 'App\\Models\\User', 51, 'main', 'e16a82516e1c15db2d0b3c4c8c04fee8c69a56c8c16d5470f08b8c9011e12cca', '[\"*\"]', NULL, '2024-09-20 07:13:38', '2024-09-20 07:13:38'),
(440, 'App\\Models\\User', 51, 'main', '9c0c66e2a4a4df575d1c8cc18cf64232b4434679534681367f29b950e3453b95', '[\"*\"]', NULL, '2024-09-20 07:15:00', '2024-09-20 07:15:00'),
(441, 'App\\Models\\User', 51, 'main', 'cbe9d583bc72f625965930698b23eb050bd834cf8e1477e8012a5b573a11b72e', '[\"*\"]', NULL, '2024-09-20 07:16:10', '2024-09-20 07:16:10'),
(442, 'App\\Models\\User', 51, 'main', 'dd7179c4882d71ab225f7b232b126772626a6b1f750bf2235cf7d0d9c6d2d571', '[\"*\"]', NULL, '2024-09-20 07:20:02', '2024-09-20 07:20:02'),
(443, 'App\\Models\\User', 51, 'main', 'a23d314fabf5ba1c9bf5b6af2b4b90e8d69557a3dcb5dbd444038abd90210bfc', '[\"*\"]', NULL, '2024-09-20 07:40:49', '2024-09-20 07:40:49'),
(444, 'App\\Models\\User', 51, 'main', '30ca1de1ce0a4e40d25fa4781eaecfbd72d3acbe4bb29b8c5d66ef302f9a54ee', '[\"*\"]', NULL, '2024-09-20 07:44:24', '2024-09-20 07:44:24'),
(445, 'App\\Models\\User', 51, 'main', '39b56cc7b3f585c77e810f49e7da68270ec73dbd7faf7ed6fd3164f7718b371a', '[\"*\"]', NULL, '2024-09-20 07:47:45', '2024-09-20 07:47:45'),
(446, 'App\\Models\\User', 51, 'main', '9d09cbc32f25df66bc7eced761812306e071ff28325cc6c35dd11cb8003c02f3', '[\"*\"]', NULL, '2024-09-20 07:49:35', '2024-09-20 07:49:35'),
(447, 'App\\Models\\User', 51, 'main', '5949d0aed176bc818ac1278a70fd40d36b10b6802e7c0885c76f84ce578d087a', '[\"*\"]', NULL, '2024-09-20 07:50:13', '2024-09-20 07:50:13'),
(448, 'App\\Models\\User', 51, 'main', '81fba875217914c36ea4fa83be355a2e76c9eaf2bcb98c72c0a3de557f056b8c', '[\"*\"]', NULL, '2024-09-20 07:54:42', '2024-09-20 07:54:42'),
(449, 'App\\Models\\User', 51, 'main', '13e98d2af137c5e7f37c7d21cb2e50a3e5adf73a69467df00f732fe9ecf19636', '[\"*\"]', NULL, '2024-09-20 08:02:47', '2024-09-20 08:02:47'),
(450, 'App\\Models\\User', 51, 'main', '182ba8d4d6c969836d8b164a68130e1c1cb1fec3b217cb61a5f402851bf98ed6', '[\"*\"]', NULL, '2024-09-20 08:19:36', '2024-09-20 08:19:36'),
(451, 'App\\Models\\User', 51, 'main', '22af807461b2646b0b176fd80a60d90547b1bf9bd135f7e51e99002ea814d29c', '[\"*\"]', NULL, '2024-09-20 08:21:45', '2024-09-20 08:21:45'),
(452, 'App\\Models\\User', 51, 'main', 'eb1546b9e67d91fba149e871a99ac1db9e72a3a37232a8539372feee81347351', '[\"*\"]', NULL, '2024-09-20 08:30:42', '2024-09-20 08:30:42'),
(453, 'App\\Models\\User', 51, 'main', '23a3ab1dc8123370534cce9f6477eb4afb02a646a8c4f24c53b75692e6c46ed3', '[\"*\"]', NULL, '2024-09-20 08:31:19', '2024-09-20 08:31:19'),
(454, 'App\\Models\\User', 51, 'main', '3e199b05d7874dc0bf7240056a07ae7a71091356c2a764912917149cbf4c6c4a', '[\"*\"]', NULL, '2024-09-20 08:39:20', '2024-09-20 08:39:20'),
(455, 'App\\Models\\User', 51, 'main', 'bbf467f6e70e868936027f5ad648329416682a474253ea653d0f681dec5de7a6', '[\"*\"]', NULL, '2024-09-20 08:55:11', '2024-09-20 08:55:11'),
(456, 'App\\Models\\User', 51, 'main', '525a1a6e154752f8a01dd9b5b9f2aa1a2816fe6519612abed1af38bb95371c64', '[\"*\"]', NULL, '2024-09-20 09:00:52', '2024-09-20 09:00:52'),
(457, 'App\\Models\\User', 51, 'main', '29eaf44d485231cb26e7d5f800366f8d20ab39f7147b456c0f4a3f137e5fc623', '[\"*\"]', NULL, '2024-09-20 09:39:29', '2024-09-20 09:39:29'),
(458, 'App\\Models\\User', 51, 'main', 'c61c536d976d8d96e11b3dae47ca732418665758866a59a9c0763ebb6d25ad89', '[\"*\"]', NULL, '2024-09-20 09:51:43', '2024-09-20 09:51:43'),
(459, 'App\\Models\\User', 51, 'main', 'f1643b41a7d60e4df8c506f991f903c4dabd180b93da7012187f6f8fcca82b5b', '[\"*\"]', NULL, '2024-09-20 15:19:56', '2024-09-20 15:19:56'),
(460, 'App\\Models\\User', 51, 'main', 'd5541a6f9512c5f2be36f5dffc122331e6ceb9d69322c41a0290ba7765ed7f4b', '[\"*\"]', NULL, '2024-09-23 07:00:01', '2024-09-23 07:00:01'),
(461, 'App\\Models\\User', 51, 'main', 'f3231dc40e401c37a7953c2abb539846fbd9b6e1ae8853109ccca95ffaa87a0f', '[\"*\"]', NULL, '2024-09-23 07:01:12', '2024-09-23 07:01:12'),
(462, 'App\\Models\\User', 51, 'main', 'fa324d8647f1d11df5c77c58d505199c225b0872c95a3ac4bf58d7ae9025135a', '[\"*\"]', NULL, '2024-09-23 07:04:03', '2024-09-23 07:04:03'),
(463, 'App\\Models\\User', 51, 'main', 'e98f4d3aa0fd5b5544f3d53377ad379ca0facd7821ebece6c40bb1f80bf5d3c8', '[\"*\"]', NULL, '2024-09-23 07:05:39', '2024-09-23 07:05:39'),
(464, 'App\\Models\\User', 51, 'main', 'd464acf42166b816a7b8a4978c0b5a80d9f207b814c48acfd9a74a000df0bfc1', '[\"*\"]', NULL, '2024-09-23 07:07:35', '2024-09-23 07:07:35'),
(465, 'App\\Models\\User', 51, 'main', '60bce64772c91cc22592f733715fcd816358c91fbf5019f24f329d0921f2b501', '[\"*\"]', NULL, '2024-09-23 07:08:40', '2024-09-23 07:08:40'),
(466, 'App\\Models\\User', 51, 'main', '0190546f0dd581e7953046b5f8a63caf98aa20e3128e62b39c7058fab02b770b', '[\"*\"]', NULL, '2024-09-23 07:13:32', '2024-09-23 07:13:32'),
(467, 'App\\Models\\User', 51, 'main', 'aaaa03b556c71e63d8e055ec089d9fb0272a8602541ab67530abf3c2afa7bcd1', '[\"*\"]', NULL, '2024-09-23 07:25:03', '2024-09-23 07:25:03'),
(468, 'App\\Models\\User', 51, 'main', '81ce51015692af15e3c10ab4ca368d5f3ee78902e48876a2377b8cf19f87f8e3', '[\"*\"]', NULL, '2024-09-23 07:27:14', '2024-09-23 07:27:14'),
(469, 'App\\Models\\User', 51, 'main', 'aa15e1099b23540dc50dce7a414ea662137c71e09244615a464e9f4ab444fa2e', '[\"*\"]', NULL, '2024-09-23 09:03:09', '2024-09-23 09:03:09'),
(470, 'App\\Models\\User', 51, 'main', '713dd65e2f6346c3979c14259f5f15436c06883e552b920840328e50bd96124e', '[\"*\"]', NULL, '2024-09-23 09:04:11', '2024-09-23 09:04:11'),
(471, 'App\\Models\\User', 51, 'main', 'd6a04a4f61f94cb787e44c947cd654684dcbb269c0994a6f04de40993d46641b', '[\"*\"]', NULL, '2024-09-23 09:10:36', '2024-09-23 09:10:36'),
(472, 'App\\Models\\User', 51, 'main', 'd263cf1dd745308ae7586deb486b123dd5d229d089c3f88f819c657429c1e04b', '[\"*\"]', NULL, '2024-09-23 12:14:50', '2024-09-23 12:14:50'),
(473, 'App\\Models\\User', 51, 'main', '8f50f52ae965cd18e98cdec4fc0edde7a089aa206d5418772212f7da45807949', '[\"*\"]', NULL, '2024-09-23 12:30:39', '2024-09-23 12:30:39'),
(474, 'App\\Models\\User', 51, 'main', 'b61dbbbddf46f2228242903609b07e64c923e6b5534d05b85ce1bed6d2055d5b', '[\"*\"]', NULL, '2024-09-23 12:33:35', '2024-09-23 12:33:35'),
(475, 'App\\Models\\User', 51, 'main', 'ea0b440e68dd552c836257a5a56485dcc91ed748ee223291d6708c353ebb1ebc', '[\"*\"]', NULL, '2024-09-23 13:07:51', '2024-09-23 13:07:51'),
(476, 'App\\Models\\User', 51, 'main', '616ed7bb1c87e847abfc28ccb62ffbbe62b8369a210e889ad6910f0bdd03e822', '[\"*\"]', NULL, '2024-09-23 13:09:01', '2024-09-23 13:09:01'),
(477, 'App\\Models\\User', 51, 'main', '0e93feaa95474063279da61893b6f2b57d8e656290256445b4d8c1a261c6f9d0', '[\"*\"]', NULL, '2024-09-23 13:12:53', '2024-09-23 13:12:53'),
(478, 'App\\Models\\User', 51, 'main', 'b66e49c570a8718277bc911e0a670615b53050011b406e78718882ccbdb0cb64', '[\"*\"]', NULL, '2024-09-23 13:30:03', '2024-09-23 13:30:03'),
(479, 'App\\Models\\User', 51, 'main', '2081a01ccf316cef960fddfd15d0b0908c6316d35ca36be64ffc6c2ba6c4e03f', '[\"*\"]', NULL, '2024-09-23 13:45:37', '2024-09-23 13:45:37'),
(480, 'App\\Models\\User', 51, 'main', '0ff6dfb236063b4f687ba3e336cf2e747c63ce89d8f93da0265357e970d62230', '[\"*\"]', NULL, '2024-09-23 13:51:15', '2024-09-23 13:51:15'),
(481, 'App\\Models\\User', 51, 'main', '955ca2532536e23190d2c1dce8bdf3cdf29ce0dedf8b05007e87477657398665', '[\"*\"]', NULL, '2024-09-23 13:52:18', '2024-09-23 13:52:18'),
(482, 'App\\Models\\User', 51, 'main', 'e9509ceab069c2bebe8f01f2e1e3811feb83281689b1b02e4654be25557d1b5e', '[\"*\"]', NULL, '2024-09-23 14:03:12', '2024-09-23 14:03:12'),
(483, 'App\\Models\\User', 51, 'main', '4a54241789f26ba7069f84fc65197ff140221d9b071203a66dcddd9cb462192b', '[\"*\"]', NULL, '2024-09-23 14:04:09', '2024-09-23 14:04:09'),
(484, 'App\\Models\\User', 51, 'main', '6e404209289cbf1d123eded3c322caa61fa3c3efb462fbd610c3781c5c2b6b5c', '[\"*\"]', NULL, '2024-09-23 14:05:40', '2024-09-23 14:05:40'),
(485, 'App\\Models\\User', 51, 'main', 'b55c9a77c372c40046d588a953bc02c33e11a17990a3bd5284940695040513c2', '[\"*\"]', NULL, '2024-09-23 14:10:13', '2024-09-23 14:10:13'),
(486, 'App\\Models\\User', 51, 'main', '5719304417cf2350cdc239684e97f406febb1aa669d6c9908e434a31b7d52220', '[\"*\"]', NULL, '2024-09-23 14:10:29', '2024-09-23 14:10:29'),
(487, 'App\\Models\\User', 51, 'main', 'a45e2e16c58d25831939ba2eb3d9ff934271940eec3aa75ae55c3c4de67aea34', '[\"*\"]', NULL, '2024-09-23 14:11:34', '2024-09-23 14:11:34'),
(488, 'App\\Models\\User', 51, 'main', '16ce9872906894f1e182921aeea3c7ff6ae219978b6b4416089eb124ac816b2c', '[\"*\"]', NULL, '2024-09-23 14:16:03', '2024-09-23 14:16:03'),
(489, 'App\\Models\\User', 51, 'main', '0668584729ea8b698f4f3f5147abaf820c6e21a4e0d30c425c29a04ba1a38eb3', '[\"*\"]', NULL, '2024-09-23 14:16:38', '2024-09-23 14:16:38'),
(490, 'App\\Models\\User', 51, 'main', 'c403aa13273c4ed99e1ccf71db42c294fd50940d53ef53659b274bf4fa10f62d', '[\"*\"]', NULL, '2024-09-23 14:20:14', '2024-09-23 14:20:14'),
(491, 'App\\Models\\User', 51, 'main', '1d5745aba66d05ea80975b9579b90c41b1e7632b2242cab4cec7a8830c309680', '[\"*\"]', NULL, '2024-09-23 14:23:01', '2024-09-23 14:23:01'),
(492, 'App\\Models\\User', 51, 'main', 'a678da64be5061b078351dbadf5d9081111cac3abd2fa0f426fb8644f6d190bd', '[\"*\"]', NULL, '2024-09-23 14:28:03', '2024-09-23 14:28:03'),
(493, 'App\\Models\\User', 51, 'main', '1e1c9729c027dacfe4115d2f3fcfaaad8711492bc86dff18a8e0f9f5f9bb84c7', '[\"*\"]', NULL, '2024-09-23 14:29:50', '2024-09-23 14:29:50'),
(494, 'App\\Models\\User', 51, 'main', 'b54a919856b61d9a43a0af0d3ea5a46a3ef7f391c40889784a26cb72256e2ecf', '[\"*\"]', NULL, '2024-09-23 14:32:13', '2024-09-23 14:32:13'),
(495, 'App\\Models\\User', 51, 'main', 'a89360462dd74405a2d23bb34a9e3ebff529e03627133ae0d7374f33554c5ce8', '[\"*\"]', NULL, '2024-09-23 14:34:52', '2024-09-23 14:34:52'),
(496, 'App\\Models\\User', 51, 'main', 'a2aacae650461981932413cba2f99b80c861b14578385a317224298b6b09f973', '[\"*\"]', NULL, '2024-09-23 14:37:50', '2024-09-23 14:37:50'),
(497, 'App\\Models\\User', 51, 'main', 'a844690a74e314ef894cd9a6fdb43a0c47889ad6433c30fd0debe1f613a8bdb7', '[\"*\"]', NULL, '2024-09-23 14:41:57', '2024-09-23 14:41:57'),
(498, 'App\\Models\\User', 51, 'main', 'a0739ecef33d395a3d7e64cccd964af5a5ab497553ca876d60b7434ad601240a', '[\"*\"]', NULL, '2024-09-23 14:45:24', '2024-09-23 14:45:24'),
(499, 'App\\Models\\User', 51, 'main', '327924cee6a47bd57bf3f10be332acd901effbcda87df0215682e0652fb2e509', '[\"*\"]', NULL, '2024-09-23 15:07:17', '2024-09-23 15:07:17'),
(500, 'App\\Models\\User', 51, 'main', 'ee045c2fd26f746fb7a3532e38e76d6bb9e9c3b25dc7865054e34fc91a0e8dc6', '[\"*\"]', NULL, '2024-09-23 15:12:35', '2024-09-23 15:12:35'),
(501, 'App\\Models\\User', 51, 'main', '953a94f8381027f88b0b55784f583d0ea662d320df9f9bc02a94ab2521378b52', '[\"*\"]', NULL, '2024-09-23 15:13:14', '2024-09-23 15:13:14'),
(502, 'App\\Models\\User', 51, 'main', 'eb2f87fef4999abc460bd14c0e76cebb69be81a3300108c6cc6b9ad10ecd1437', '[\"*\"]', NULL, '2024-09-23 15:14:33', '2024-09-23 15:14:33'),
(503, 'App\\Models\\User', 51, 'main', '562cabe8464f145b3ef7f68f926c7c77bd0d13f9525c5c05942d32367ff19570', '[\"*\"]', NULL, '2024-09-23 15:16:42', '2024-09-23 15:16:42'),
(504, 'App\\Models\\User', 51, 'main', '38f49eab301420c608809e3afbe2d997eec8d16fd000ebc87a2abc2f51812e39', '[\"*\"]', NULL, '2024-09-23 15:18:31', '2024-09-23 15:18:31'),
(505, 'App\\Models\\User', 51, 'main', '1eb7ef31c366a4cfac8408b08a70c01acd79e727a85c3ff4acb43fa5df329725', '[\"*\"]', NULL, '2024-09-23 15:27:33', '2024-09-23 15:27:33'),
(506, 'App\\Models\\User', 51, 'main', 'fae98452851e1fe2ab0821424586d1098fcb47f272a7d9fdcd9714509f0297c5', '[\"*\"]', NULL, '2024-09-23 15:32:36', '2024-09-23 15:32:36'),
(507, 'App\\Models\\User', 51, 'main', '34131147075d170b7124a8a5f4e1333703030219ff62c72cd7e3eb6148582c1e', '[\"*\"]', NULL, '2024-09-23 15:35:28', '2024-09-23 15:35:28'),
(508, 'App\\Models\\User', 51, 'main', 'fe18d6cf605b232387a2e979c8b514ed3cce448adec774ef2ad08026de358fbd', '[\"*\"]', NULL, '2024-09-23 15:37:20', '2024-09-23 15:37:20'),
(509, 'App\\Models\\User', 51, 'main', '9ddf77f7111e9af74930d7f4fbde289b730cdd41f6fe72d8533f247364224331', '[\"*\"]', NULL, '2024-09-23 15:40:17', '2024-09-23 15:40:17'),
(510, 'App\\Models\\User', 51, 'main', '7a645c373b6506ad6cbbb953405693666f08fd14838b8fad1bf03b49eb228373', '[\"*\"]', NULL, '2024-09-24 06:04:06', '2024-09-24 06:04:06'),
(511, 'App\\Models\\User', 51, 'main', '7bc43588941219a69ad6e5439e4d80ecdad62ec7b3fe435361d76c65140603ac', '[\"*\"]', NULL, '2024-09-24 07:06:30', '2024-09-24 07:06:30'),
(512, 'App\\Models\\User', 51, 'main', 'f646fadda4af4431d682c4076881421bcc18919349b0e5518b52b2ee8e75a50e', '[\"*\"]', NULL, '2024-09-24 07:09:29', '2024-09-24 07:09:29'),
(513, 'App\\Models\\User', 51, 'main', '92b2c6a5db0874d18ed6aae6d5e710b1389e3b792f1d113c7604de0ed23d4640', '[\"*\"]', NULL, '2024-09-24 07:36:16', '2024-09-24 07:36:16'),
(514, 'App\\Models\\User', 51, 'main', '557b41c42bbba075dd78862b9475d6bd4576fb08d0f02e2256c5db6ae1e10a70', '[\"*\"]', NULL, '2024-09-24 07:36:43', '2024-09-24 07:36:43'),
(515, 'App\\Models\\User', 51, 'main', '2273b70700895a75bda543a9b43c058e106a87f5f176c308b208cb3e3caa0a84', '[\"*\"]', NULL, '2024-09-24 07:43:52', '2024-09-24 07:43:52'),
(516, 'App\\Models\\User', 51, 'main', '98b126cbd160ae4a34405c5060c880dd830f9e4e61ced3a8c88e3133246dea42', '[\"*\"]', NULL, '2024-09-24 07:46:30', '2024-09-24 07:46:30'),
(517, 'App\\Models\\User', 51, 'main', 'a8e97783991bc3b7e5c1f3189d3298f0d6ead0fae8c0f88fdc2c060234d9cfd0', '[\"*\"]', NULL, '2024-09-24 07:54:42', '2024-09-24 07:54:42'),
(518, 'App\\Models\\User', 51, 'main', '105cdbd888502940c12b67f86733470660f0612a0bedab9deb2a08705ae62b23', '[\"*\"]', NULL, '2024-09-24 07:59:31', '2024-09-24 07:59:31'),
(519, 'App\\Models\\User', 51, 'main', 'f7c06e583a5d5181424f06423527984746c37bf8bb894a8abedd18c165ac72eb', '[\"*\"]', NULL, '2024-09-24 08:00:03', '2024-09-24 08:00:03'),
(520, 'App\\Models\\User', 51, 'main', '323029d4399755bc636c555329f9a4ede5c831087ea39a0b5cba5fc9ed3ff603', '[\"*\"]', NULL, '2024-09-24 08:53:55', '2024-09-24 08:53:55'),
(521, 'App\\Models\\User', 51, 'main', 'feac7c6e3b01ef95d2520c8bf9d2bd1786ff546a4961050bb3e886409b9513e9', '[\"*\"]', NULL, '2024-09-24 09:05:02', '2024-09-24 09:05:02'),
(522, 'App\\Models\\User', 51, 'main', 'ebc8dd08a949424cc33130c343c4a0ea08bb676373d6e809ce7a12641952e581', '[\"*\"]', NULL, '2024-09-24 09:08:50', '2024-09-24 09:08:50'),
(523, 'App\\Models\\User', 51, 'main', '5aeac63f6049ae16bdcd163609be8e86df313e568af2bea9db93af445d05d06d', '[\"*\"]', NULL, '2024-09-24 09:32:15', '2024-09-24 09:32:15'),
(524, 'App\\Models\\User', 51, 'main', '4ced1b0f8d61093c2284aac00a891efa10e209dfa2b017a2d730c5ea286cb370', '[\"*\"]', NULL, '2024-09-24 09:34:29', '2024-09-24 09:34:29'),
(525, 'App\\Models\\User', 51, 'main', '06ccef9b10f6e9e155f8c1443b579619a716bd867d7a65b6666246ac5b6324d3', '[\"*\"]', NULL, '2024-09-24 09:36:59', '2024-09-24 09:36:59'),
(526, 'App\\Models\\User', 51, 'main', 'c02cdc17655598d93f6601a4c8794a3ffa5e05148b3bb547daa38852cdf1e9c0', '[\"*\"]', NULL, '2024-09-24 09:41:11', '2024-09-24 09:41:11'),
(527, 'App\\Models\\User', 51, 'main', '541f8ca46731506fd3050dc281c084b2e1df92db94784060cb330f8d1b580ce7', '[\"*\"]', NULL, '2024-09-24 09:44:12', '2024-09-24 09:44:12'),
(528, 'App\\Models\\User', 51, 'main', '4f2d4476c79c0eb1c16c5dea971dc6bfdf93de578479f89e7550fce2328aa58c', '[\"*\"]', NULL, '2024-09-24 09:49:34', '2024-09-24 09:49:34'),
(529, 'App\\Models\\User', 51, 'main', '117bb5c7db27329233d3fd0ec5fe5dc9507779748584353426738141461af250', '[\"*\"]', NULL, '2024-09-25 11:01:17', '2024-09-25 11:01:17'),
(530, 'App\\Models\\User', 51, 'main', 'b7fe54582bd6e0bff28f5252651f14ad49d3307b103618828998868cd6e4379c', '[\"*\"]', NULL, '2024-09-25 11:03:11', '2024-09-25 11:03:11'),
(531, 'App\\Models\\User', 51, 'main', '6ace5c8533d08c0b681fd2b917648b1d7f60ad8865dae33af131c2aa8e8f1e1f', '[\"*\"]', NULL, '2024-09-25 11:07:40', '2024-09-25 11:07:40'),
(532, 'App\\Models\\User', 51, 'main', 'c4249c8265b7f952cc5e8f8835ad5d366542392b28c54bc9660adb91c2a14c7e', '[\"*\"]', NULL, '2024-09-25 11:09:07', '2024-09-25 11:09:07'),
(533, 'App\\Models\\User', 51, 'main', '8427787c93aaf616d98cbe32a0883fd10a105745b7be154be091bc82ed7d6734', '[\"*\"]', NULL, '2024-09-25 11:14:35', '2024-09-25 11:14:35'),
(534, 'App\\Models\\User', 51, 'main', '08c4379a93d6c203e02c239326f123c2dd830cc22d47b17c409dd0bd847fdb26', '[\"*\"]', NULL, '2024-09-25 13:05:19', '2024-09-25 13:05:19'),
(535, 'App\\Models\\User', 51, 'main', '537a86794b7ade6ac745c7ee47e49ebab82ed3258f497a9a7f72c3b94490da82', '[\"*\"]', NULL, '2024-09-25 13:53:50', '2024-09-25 13:53:50'),
(536, 'App\\Models\\User', 51, 'main', '9e888c91ff7c88b72586006017b4b2beb066ca2cb53de594c8814ffe8678787c', '[\"*\"]', NULL, '2024-09-25 14:00:07', '2024-09-25 14:00:07'),
(537, 'App\\Models\\User', 51, 'main', 'a01654d62cae9e01f80305c0f5edcad46edc861c1a448c805864121e02b88f12', '[\"*\"]', NULL, '2024-09-25 14:08:15', '2024-09-25 14:08:15'),
(538, 'App\\Models\\User', 51, 'main', '610c6aafbaaff8927752ac443f3cb7a83314aad2abe7d603aede31555cae6f1e', '[\"*\"]', NULL, '2024-09-25 14:08:54', '2024-09-25 14:08:54'),
(539, 'App\\Models\\User', 51, 'main', '6651df93c3b9feae445575267062d0ace3891fa59b324dcad0c05a815ac24a4a', '[\"*\"]', NULL, '2024-09-25 14:12:18', '2024-09-25 14:12:18'),
(540, 'App\\Models\\User', 51, 'main', '39d5933f5411b6f3cd79716a361aa410c0c36f2b5467e8b4f1fccfd58169cc8a', '[\"*\"]', NULL, '2024-09-25 14:12:42', '2024-09-25 14:12:42'),
(541, 'App\\Models\\User', 51, 'main', '7b0d837d06bef7b32ac9604409ec930ab84789948e8877984f4b20b1b7fd6989', '[\"*\"]', NULL, '2024-09-25 14:21:47', '2024-09-25 14:21:47'),
(542, 'App\\Models\\User', 51, 'main', '8872b81fe32dd16f510ce422b53ccfcb8047c7730afed821c3915b3cc53558c1', '[\"*\"]', NULL, '2024-09-25 14:32:23', '2024-09-25 14:32:23'),
(543, 'App\\Models\\User', 51, 'main', '4c42640fb8c6a9dbe42b56d8e9c0e2545cf06d2b994bec549767809c5ac4c006', '[\"*\"]', NULL, '2024-09-25 14:47:32', '2024-09-25 14:47:32'),
(544, 'App\\Models\\User', 51, 'main', '133423e9c9870e58a3c68f625fd90d35a9d1d0791241b5dce94bc7eec04a8e43', '[\"*\"]', NULL, '2024-09-25 14:56:06', '2024-09-25 14:56:06'),
(545, 'App\\Models\\User', 51, 'main', 'a3b0f3e614b6815ce66b8e982b9f6e7aea22a6d988a42e5efae72e9fabfc0c12', '[\"*\"]', NULL, '2024-09-25 15:16:02', '2024-09-25 15:16:02'),
(546, 'App\\Models\\User', 51, 'main', 'cd3c48805cf750afafcd60a7b9594df95105b608a446a1c6fd50105953d1db26', '[\"*\"]', NULL, '2024-09-25 15:19:55', '2024-09-25 15:19:55'),
(547, 'App\\Models\\User', 51, 'main', '48cc5f59550aaa473ac690ab62b19cb23e2a53ba4e42fe67c6ff5d850493457c', '[\"*\"]', NULL, '2024-09-25 15:40:08', '2024-09-25 15:40:08'),
(548, 'App\\Models\\User', 51, 'main', 'e68dd0864b5dda3d293799083ab655beceb77bf5c7014967fffc90f6d95e8f05', '[\"*\"]', NULL, '2024-09-25 15:44:34', '2024-09-25 15:44:34'),
(549, 'App\\Models\\User', 51, 'main', '967fa258917ca78c5e3ecdccefff14e1666fe0401d8ed1cd9538b3d16586cdb3', '[\"*\"]', NULL, '2024-09-25 15:50:32', '2024-09-25 15:50:32'),
(550, 'App\\Models\\User', 51, 'main', 'd909dbb2a9cb06fee8726946acd261fae1b80dbbbced8ad4b3dceaa5191420b2', '[\"*\"]', NULL, '2024-09-25 15:54:41', '2024-09-25 15:54:41'),
(551, 'App\\Models\\User', 51, 'main', 'd5c27c114351ba3c295ea0b7038e488efbad4c32db03c1fe09d994bdbab7cf77', '[\"*\"]', NULL, '2024-09-25 15:55:59', '2024-09-25 15:55:59'),
(552, 'App\\Models\\User', 51, 'main', 'a4af47b9d7fdf26cdfd65ae0ac4018be71ec7e6d056d205f5842472d1430314a', '[\"*\"]', NULL, '2024-09-26 06:25:41', '2024-09-26 06:25:41'),
(553, 'App\\Models\\User', 51, 'main', '87e801cc079e9d78314927bfe5deeaf95f29e49e0c56c8f2bc4b7191a608f332', '[\"*\"]', NULL, '2024-09-26 07:53:42', '2024-09-26 07:53:42'),
(554, 'App\\Models\\User', 51, 'main', 'acfad035ca4ead236195c67835a08dd7ff01825f05bc7c0014248b38661f9484', '[\"*\"]', NULL, '2024-09-26 07:58:11', '2024-09-26 07:58:11'),
(555, 'App\\Models\\User', 51, 'main', '100debbb19d1195ef3c3d1e6360956f55fb8f2c8390f1287f65b0a6833ff4093', '[\"*\"]', NULL, '2024-09-26 08:08:29', '2024-09-26 08:08:29'),
(556, 'App\\Models\\User', 51, 'main', 'c835ae5aa3e6cc4e242ae98e94df912d79b8b97d2753d41b08aba1ab3471fe78', '[\"*\"]', NULL, '2024-09-26 08:12:17', '2024-09-26 08:12:17'),
(557, 'App\\Models\\User', 51, 'main', '1b48ca87b07e4e5d706fbb0d46809e93a7255e982029abce694ee035f56f0818', '[\"*\"]', NULL, '2024-09-26 08:16:34', '2024-09-26 08:16:34'),
(558, 'App\\Models\\User', 51, 'main', 'f05254b67193d7a96eded8350a49c5dd92825828a6effc981cc81d70f9494864', '[\"*\"]', NULL, '2024-09-26 08:18:16', '2024-09-26 08:18:16'),
(559, 'App\\Models\\User', 51, 'main', '9ce85fa96bc9a515ddcec0b15f573089bcc19467457a4be46a34f1497d47118c', '[\"*\"]', NULL, '2024-09-26 08:19:19', '2024-09-26 08:19:19'),
(560, 'App\\Models\\User', 51, 'main', '87c9da9e8b9a88622a01b59ffa9c1bbbdde166795c44c700edced7b49ceb4431', '[\"*\"]', NULL, '2024-09-26 08:31:23', '2024-09-26 08:31:23'),
(561, 'App\\Models\\User', 51, 'main', '36afb4f0c329187e507fa5b967aaca9a580443acdbc92ab2280771d3b709bad1', '[\"*\"]', NULL, '2024-09-26 08:33:05', '2024-09-26 08:33:05'),
(562, 'App\\Models\\User', 51, 'main', '0903d52dc92b479da107009f4b042db9679f54bc07d98fc976a0aaaf0357e6e1', '[\"*\"]', NULL, '2024-09-26 08:35:04', '2024-09-26 08:35:04'),
(563, 'App\\Models\\User', 51, 'main', '35e0181a0bc84894f02ac14d53cb5e76728668d7d79ca6c2b9b6aafbda0781e6', '[\"*\"]', NULL, '2024-09-26 09:20:08', '2024-09-26 09:20:08'),
(564, 'App\\Models\\User', 51, 'main', '607d9be93a4f3fb457dedea351de528af0275d8530c35782268382de529757f7', '[\"*\"]', NULL, '2024-09-26 09:21:28', '2024-09-26 09:21:28'),
(565, 'App\\Models\\User', 51, 'main', '44601342d07eecdf785f9e9e3cbbb2c9af6fca25e47908a2c59ac03511ee76af', '[\"*\"]', NULL, '2024-09-26 09:57:55', '2024-09-26 09:57:55'),
(566, 'App\\Models\\User', 51, 'main', '4b36c77d50a157dca70787818c77f310272af5f8d383db7e7e250d864b2fcf28', '[\"*\"]', NULL, '2024-09-26 10:05:40', '2024-09-26 10:05:40'),
(567, 'App\\Models\\User', 51, 'main', 'de29b2edee15d53b78aa757db2bc99e83527be077876d3e384e640ef4e9156a8', '[\"*\"]', NULL, '2024-09-26 10:06:56', '2024-09-26 10:06:56'),
(568, 'App\\Models\\User', 51, 'main', 'da19da5ed23dec323931f688d878f1676302e3220b89feda21b030dd52433d31', '[\"*\"]', NULL, '2024-09-26 10:22:07', '2024-09-26 10:22:07'),
(569, 'App\\Models\\User', 51, 'main', '76265731ca9957737b645beefa2dd4c9d691e2165135084fc5b579db47817a02', '[\"*\"]', NULL, '2024-09-26 10:42:45', '2024-09-26 10:42:45'),
(570, 'App\\Models\\User', 51, 'main', '26eb7080f1a72201151dddf237c00ae6f76cea81f6afa25765d703a05eb7563b', '[\"*\"]', NULL, '2024-09-26 11:04:46', '2024-09-26 11:04:46'),
(571, 'App\\Models\\User', 51, 'main', '55e1ef81b03767395914b1e96f039830eef4b6dad8a032549b461f48c2a9ac2d', '[\"*\"]', NULL, '2024-09-26 11:08:03', '2024-09-26 11:08:03'),
(572, 'App\\Models\\User', 51, 'main', '43b723c25b15c4038e3d22016dd70f9f050cf97de25192ddcd0c73193e00f738', '[\"*\"]', NULL, '2024-09-27 07:34:42', '2024-09-27 07:34:42'),
(573, 'App\\Models\\User', 51, 'main', 'ff1c07e2c3d00bdc733c913b5a0c3eb125f7060f87ee46a70023aed6b90f4bd7', '[\"*\"]', NULL, '2024-09-27 07:42:30', '2024-09-27 07:42:30'),
(574, 'App\\Models\\User', 51, 'main', '552ff8cfdfa59b76eacf6445ef23be8ad977a18c7b862bc816871383933024e4', '[\"*\"]', NULL, '2024-09-27 07:52:01', '2024-09-27 07:52:01'),
(575, 'App\\Models\\User', 51, 'main', '12a0d356375276823f4b7bf4b17ea88bacdc2e5906cf7511900b708009274495', '[\"*\"]', NULL, '2024-09-27 07:53:26', '2024-09-27 07:53:26'),
(576, 'App\\Models\\User', 51, 'main', '09c68ed6f83512e65d5deb4f1e08a6170c87f875f433f87d513a77be215fd2ed', '[\"*\"]', NULL, '2024-09-27 07:54:17', '2024-09-27 07:54:17'),
(577, 'App\\Models\\User', 51, 'main', '47edca473e8cf6006a825ac2b4893a9fe021a3f092ca279b7e8d76847d4a7f35', '[\"*\"]', NULL, '2024-09-27 07:57:38', '2024-09-27 07:57:38'),
(578, 'App\\Models\\User', 65, 'main', 'ab51a68e4014f0167192effe59bb58a3ea7e25a3755c5e8cc829831c852703c0', '[\"*\"]', NULL, '2024-09-27 08:00:04', '2024-09-27 08:00:04'),
(579, 'App\\Models\\User', 51, 'main', '92da63192b681bf4f372a4b0634e55189aa7614d6eb7665e6971489f1757bbb6', '[\"*\"]', NULL, '2024-09-27 08:03:32', '2024-09-27 08:03:32'),
(580, 'App\\Models\\User', 51, 'main', '6c59f26829467a84cb26e5d6000a3bdb7de4fadeddcc38dc0aef1b4bd837edb7', '[\"*\"]', NULL, '2024-09-27 08:04:32', '2024-09-27 08:04:32'),
(581, 'App\\Models\\User', 65, 'main', '9885e62823349a221d7fe24db82a238567a995ee1ee6b4273ff992fa5c29527a', '[\"*\"]', NULL, '2024-09-27 08:05:57', '2024-09-27 08:05:57'),
(582, 'App\\Models\\User', 51, 'main', '2d1eb0866a26f1dd881e610d1c1e1cb5502c5c9f4fe22b5a44caed25e494859e', '[\"*\"]', NULL, '2024-09-27 08:09:53', '2024-09-27 08:09:53'),
(583, 'App\\Models\\User', 51, 'main', '1e6171a2204cc740b47064594665c276ad310b1948eb2c3f3e86b0773a3ee56f', '[\"*\"]', NULL, '2024-09-27 08:28:28', '2024-09-27 08:28:28'),
(584, 'App\\Models\\User', 65, 'main', '4e1e367dcc70074d9c469ec216a2a6c4760f53bbb90e0a51deec8c44e6886ddf', '[\"*\"]', NULL, '2024-09-27 08:30:06', '2024-09-27 08:30:06'),
(585, 'App\\Models\\User', 51, 'main', '64616995e8da008a7647089c7f7343aafecb971051c6a1bed03c8a8a837022e3', '[\"*\"]', NULL, '2024-09-27 08:30:50', '2024-09-27 08:30:50'),
(586, 'App\\Models\\User', 51, 'main', '2d2a308cb4660f281c6525047eaf261c25114ad34dc29e980d758749647c3e43', '[\"*\"]', NULL, '2024-09-27 08:33:56', '2024-09-27 08:33:56'),
(587, 'App\\Models\\User', 51, 'main', '0644ac805ab7cb31c0f7f1b30076815e88c7ca830ed3e9041a03badb3a0c4fe7', '[\"*\"]', NULL, '2024-09-27 08:35:19', '2024-09-27 08:35:19'),
(588, 'App\\Models\\User', 51, 'main', '245a9403fe1af3f17ff80c5608917afd0d4353fcaf9c10c178007ac2550faa8a', '[\"*\"]', NULL, '2024-09-27 08:38:07', '2024-09-27 08:38:07'),
(589, 'App\\Models\\User', 51, 'main', '61d9db54af750e00effee3ffca9e14dbfdc0a3b904840eb60080eadf401b8984', '[\"*\"]', NULL, '2024-09-27 08:43:12', '2024-09-27 08:43:12');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `created_at`, `updated_at`) VALUES
(590, 'App\\Models\\User', 51, 'main', '72fd56ae56548cc3eb78eadd916efa2303224167a2001d857b2fef4d2a8a7ce4', '[\"*\"]', NULL, '2024-09-27 09:21:44', '2024-09-27 09:21:44'),
(591, 'App\\Models\\User', 51, 'main', '2ea2c68c594f2397332a270741e6552e645a593aa37ef028538fecb4919f263c', '[\"*\"]', NULL, '2024-09-27 09:24:35', '2024-09-27 09:24:35'),
(592, 'App\\Models\\User', 51, 'main', '4163b88f9ba7e1546c31f4185dec8298d6e5034c80da60d11a71c2bae96c73a3', '[\"*\"]', NULL, '2024-09-27 09:43:23', '2024-09-27 09:43:23'),
(593, 'App\\Models\\User', 51, 'main', '9283450fca064a970e6e4dba1112bed9e122a4f9e16f6cb9761f204fd9a2c6f9', '[\"*\"]', NULL, '2024-09-27 09:53:02', '2024-09-27 09:53:02'),
(594, 'App\\Models\\User', 51, 'main', 'a852178f742c01b6f2a4d5cc8f3f953d0598246e0edfa2aebae613b5f1afe67e', '[\"*\"]', NULL, '2024-09-27 09:55:56', '2024-09-27 09:55:56'),
(595, 'App\\Models\\User', 65, 'main', '20a7346b5a19838b82af8d209906ae498eb3f58d42cce4feba54b5ebc6be514a', '[\"*\"]', NULL, '2024-09-27 10:16:54', '2024-09-27 10:16:54'),
(596, 'App\\Models\\User', 51, 'main', 'cc5a7939cf215e7ab340335c5dc19a65be8845dc950bbba08043f8706f331aa8', '[\"*\"]', NULL, '2024-09-27 10:20:52', '2024-09-27 10:20:52'),
(597, 'App\\Models\\User', 51, 'main', 'e1e2602d26b16db49c823a70e0654a7e1a5dfd5337c74df446605b0a5520fb66', '[\"*\"]', NULL, '2024-09-27 10:24:24', '2024-09-27 10:24:24'),
(598, 'App\\Models\\User', 51, 'main', '3747dbd23e5e07177636c403e830c13331929a72acf016da9f1a2b6ca93e4b5e', '[\"*\"]', NULL, '2024-09-27 10:26:57', '2024-09-27 10:26:57'),
(599, 'App\\Models\\User', 51, 'main', '357845039a20900487492e0cebfcf680686850b03b46ea30fa5c4b3ec9a834b6', '[\"*\"]', NULL, '2024-09-27 10:28:51', '2024-09-27 10:28:51'),
(600, 'App\\Models\\User', 51, 'main', 'd53fabeabb4799b12bb5379fa5c35d664822e3caad57ea07e2bc22d391f6fec2', '[\"*\"]', NULL, '2024-09-27 10:31:57', '2024-09-27 10:31:57'),
(601, 'App\\Models\\User', 51, 'main', 'b53d5a833883a18c0ef6593c8955f24aab87b5808dcbc942d7568b53bae3c85f', '[\"*\"]', NULL, '2024-09-27 10:39:19', '2024-09-27 10:39:19'),
(602, 'App\\Models\\User', 51, 'main', '05a153a256cb78c223aa2c853959319280f76860dd4bc5bce173601bad93ad04', '[\"*\"]', NULL, '2024-09-27 10:40:52', '2024-09-27 10:40:52'),
(603, 'App\\Models\\User', 51, 'main', '1c5fcf846069f4eef641f09aa804748d9aeeb9c684f1084a6882fa3273519cf1', '[\"*\"]', NULL, '2024-09-27 10:45:57', '2024-09-27 10:45:57'),
(604, 'App\\Models\\User', 51, 'main', 'b386bb089248dfad67bc00b6acb2420f59d6b4c3ed6a3ef190ee7854828ebb49', '[\"*\"]', NULL, '2024-09-27 10:47:25', '2024-09-27 10:47:25'),
(605, 'App\\Models\\User', 51, 'main', '579754457a68a42c9e914f9ce8babdba376663963e91359415900f907143a39e', '[\"*\"]', NULL, '2024-09-27 10:50:45', '2024-09-27 10:50:45'),
(606, 'App\\Models\\User', 51, 'main', '37320f2cef3f73453a872bb7a5b3c1ff79b8b1ec98f318d0073526a7de83bdcb', '[\"*\"]', NULL, '2024-09-27 10:52:30', '2024-09-27 10:52:30'),
(607, 'App\\Models\\User', 51, 'main', 'd697ad53ce49f714c76851dcd5f0a30cd7baa6be97bb2888ebc03b714c39304d', '[\"*\"]', NULL, '2024-09-27 10:54:59', '2024-09-27 10:54:59'),
(608, 'App\\Models\\User', 51, 'main', '7feec56c84446bb83e2abe9a21f392f347f71c9997b5f7bc69ce287a82175f03', '[\"*\"]', NULL, '2024-09-27 10:56:51', '2024-09-27 10:56:51'),
(609, 'App\\Models\\User', 51, 'main', 'dbaf8c37c1d8624dfeb7132737d846a5b2b10555d9d20af547c28819e770b5bc', '[\"*\"]', NULL, '2024-09-27 11:31:20', '2024-09-27 11:31:20'),
(610, 'App\\Models\\User', 51, 'main', '12c8e7f741b541db71fa4fcae1553b9912c2a922ebc1963c0a109cf6b823b955', '[\"*\"]', NULL, '2024-09-27 11:33:49', '2024-09-27 11:33:49'),
(611, 'App\\Models\\User', 51, 'main', '4233dbc5e5af447d2058cf809217256cc83c9e2c131403e262c7463fd54f4832', '[\"*\"]', NULL, '2024-09-27 11:35:40', '2024-09-27 11:35:40'),
(612, 'App\\Models\\User', 51, 'main', '1f351ef167c6c9bb3efdf95814b85f6aaba70f19acfb9e7b5e6ac90bd443e52b', '[\"*\"]', NULL, '2024-09-27 11:54:07', '2024-09-27 11:54:07'),
(613, 'App\\Models\\User', 51, 'main', '0afb2cda13cf62ccbbefae4684f1b823d91a25026f9ddba0a96d07b4d670af91', '[\"*\"]', NULL, '2024-09-27 11:56:29', '2024-09-27 11:56:29'),
(614, 'App\\Models\\User', 51, 'main', 'e3269b92ca776933d7581a026233403f29e944a75bbd0d87554bd20c7664feac', '[\"*\"]', NULL, '2024-09-27 11:59:10', '2024-09-27 11:59:10'),
(615, 'App\\Models\\User', 51, 'main', '7dd9dc9419d2cea7f6d72994425ea8cbe2c523da54ed96824ce6c942a9781027', '[\"*\"]', NULL, '2024-09-27 12:03:26', '2024-09-27 12:03:26'),
(616, 'App\\Models\\User', 51, 'main', '9c80331a9edf4e84de7607f3ba4b310f404faf049b548a89074ce315d09e4064', '[\"*\"]', NULL, '2024-09-27 12:10:01', '2024-09-27 12:10:01'),
(617, 'App\\Models\\User', 51, 'main', 'bff2cbfb93e7274a5d4ab1556b485e8b7b8f319b28521c4b597537bed4837928', '[\"*\"]', NULL, '2024-09-27 12:11:05', '2024-09-27 12:11:05'),
(618, 'App\\Models\\User', 51, 'main', '5b772ff454ad9e215a317ee2d97d3a0e745ec9a92d46d2d4b05e4d582f0c9a1a', '[\"*\"]', NULL, '2024-09-27 12:12:14', '2024-09-27 12:12:14'),
(619, 'App\\Models\\User', 51, 'main', '0dab53ac9f071f9b337b559fa35e9c965138615fca2a256173c033ec962d5a23', '[\"*\"]', NULL, '2024-09-27 12:13:28', '2024-09-27 12:13:28'),
(620, 'App\\Models\\User', 51, 'main', '4ff13a409932f3bf3eff12f3eaa29fa8226fba9d02754ed24b46e289c5b5b4d5', '[\"*\"]', NULL, '2024-09-27 12:14:58', '2024-09-27 12:14:58'),
(621, 'App\\Models\\User', 51, 'main', '0f669011fce5fad562bcb0bf198d9356caf9176d6b050f1752f403d0422b09fd', '[\"*\"]', NULL, '2024-09-27 12:16:28', '2024-09-27 12:16:28'),
(622, 'App\\Models\\User', 51, 'main', 'ab3a13d676be86641711ececccd3408aef78d83ffa6d2f269aa28f8128bfc5c6', '[\"*\"]', NULL, '2024-09-27 12:22:20', '2024-09-27 12:22:20'),
(623, 'App\\Models\\User', 51, 'main', '1f7d2fd64a8a89df7848ef69841839d0527cf7317ec14c66080e8fd52f4cc639', '[\"*\"]', NULL, '2024-09-27 12:23:14', '2024-09-27 12:23:14'),
(624, 'App\\Models\\User', 51, 'main', '4311e1c12f2b8b7a5273ff24d8c8e19229a5a6b1666a15e9c23549d27cd5821f', '[\"*\"]', NULL, '2024-09-27 12:24:08', '2024-09-27 12:24:08'),
(625, 'App\\Models\\User', 51, 'main', '453a8538aaa3ff2ee66ab25bcbd233910c8c3e0a9883587ed52812872a394f5c', '[\"*\"]', NULL, '2024-09-27 12:32:29', '2024-09-27 12:32:29'),
(626, 'App\\Models\\User', 51, 'main', 'c8e08e037602a9f577a7519a4085e27ff760eb23059e0597d3a4463c8d728d0c', '[\"*\"]', NULL, '2024-09-27 12:44:39', '2024-09-27 12:44:39'),
(627, 'App\\Models\\User', 51, 'main', '7f9ec70df1360f9873b6a0d821392e05789e8434b3320da1479a3a7118239cb6', '[\"*\"]', NULL, '2024-09-27 13:11:33', '2024-09-27 13:11:33'),
(628, 'App\\Models\\User', 51, 'main', 'd2360f3e5ecde25f0d5b65e3b8dcc8c828ed64cc3bde9b6859f8a3bd7bf4b5a4', '[\"*\"]', NULL, '2024-09-27 13:12:00', '2024-09-27 13:12:00'),
(629, 'App\\Models\\User', 51, 'main', 'f429dc39051efdcea0afd32172ca9c7d8161466ba99133b804ccd221f58d3547', '[\"*\"]', NULL, '2024-09-27 13:13:32', '2024-09-27 13:13:32'),
(630, 'App\\Models\\User', 51, 'main', 'ad5d72e7e3a16592d3e2a7c28ff9372e18c204ec637333aafcedb178ae376bab', '[\"*\"]', NULL, '2024-09-27 13:15:23', '2024-09-27 13:15:23'),
(631, 'App\\Models\\User', 51, 'main', '59f0bcd67b9628b7c5832121cd6f86580ac5f1253d2d7ac33a43ceb1c04466d1', '[\"*\"]', NULL, '2024-09-27 13:17:46', '2024-09-27 13:17:46'),
(632, 'App\\Models\\User', 51, 'main', '8387c35236726cd3d06cf2afc9367b747c1ef1f181fb45c31f2008d6673601a1', '[\"*\"]', NULL, '2024-09-27 13:20:16', '2024-09-27 13:20:16'),
(633, 'App\\Models\\User', 51, 'main', '372a362bc0c3187fcc9e941606cf079d5c2ede281573a44b36ffbc1dbf045779', '[\"*\"]', NULL, '2024-09-27 13:21:32', '2024-09-27 13:21:32'),
(634, 'App\\Models\\User', 51, 'main', '41cf960737fd6ae82abb39e194bbf1f5641c01a05a852f3347b9eca3221c6305', '[\"*\"]', NULL, '2024-09-27 13:24:18', '2024-09-27 13:24:18'),
(635, 'App\\Models\\User', 65, 'main', 'a09462ff13bbec2625c43e6663e99c896c51294cc1146882d808da03adf397ac', '[\"*\"]', NULL, '2024-09-27 13:34:35', '2024-09-27 13:34:35'),
(636, 'App\\Models\\User', 65, 'main', '1fbae6fdd93110a943484eb69f2f496d8d907aec997a2c32fd634d00e3be3f59', '[\"*\"]', NULL, '2024-09-27 13:36:16', '2024-09-27 13:36:16'),
(637, 'App\\Models\\User', 65, 'main', '8af160a2032f26da5e2304980e6ab9cc8f08e682e889eb2c11c5012dabbb2be1', '[\"*\"]', NULL, '2024-09-27 13:38:55', '2024-09-27 13:38:55'),
(638, 'App\\Models\\User', 51, 'main', '8b7c951d132b8f212f7d7a9379c6c2f98fc0859b49346790531fd7bccd411b3a', '[\"*\"]', NULL, '2024-09-27 14:13:57', '2024-09-27 14:13:57'),
(639, 'App\\Models\\User', 51, 'main', '76045e1f99165370ca513eec58ed023ab8a1e7740264d18e5985de30051c5124', '[\"*\"]', NULL, '2024-09-27 14:21:57', '2024-09-27 14:21:57'),
(640, 'App\\Models\\User', 51, 'main', '63ec2f81f23d3cf722ccfa8b056826020397dac6c1c98d96d2fda612276d91eb', '[\"*\"]', NULL, '2024-09-27 14:27:07', '2024-09-27 14:27:07'),
(641, 'App\\Models\\User', 51, 'main', '8752d1a5458db8b6f626288f692902e0892b2bda3b0a0edddc8de820a223a9f0', '[\"*\"]', NULL, '2024-09-27 14:28:53', '2024-09-27 14:28:53'),
(642, 'App\\Models\\User', 51, 'main', 'bf5ed57ca912860a14ef54612209c77c1008678db46851de72dd879456bfe186', '[\"*\"]', NULL, '2024-09-27 14:31:29', '2024-09-27 14:31:29'),
(643, 'App\\Models\\User', 51, 'main', 'f892a207a8ede36473bd47215133e54c5a080449d8eac595902d3654bae4e6ec', '[\"*\"]', NULL, '2024-09-27 14:32:03', '2024-09-27 14:32:03'),
(644, 'App\\Models\\User', 51, 'main', '69c50800dd40626ffa531236d89bff6a44175a7327249f60877902c8b936a0e5', '[\"*\"]', NULL, '2024-09-27 14:39:15', '2024-09-27 14:39:15'),
(645, 'App\\Models\\User', 51, 'main', '6ea8b465a3ddf6c078e8fd56d99ac673653791d63f6f78e6f78435a4cd61535b', '[\"*\"]', NULL, '2024-09-27 14:49:07', '2024-09-27 14:49:07'),
(646, 'App\\Models\\User', 51, 'main', 'da097b5be7259489102bccad17da909ff5d9cab13409809f2f1e7484b518c335', '[\"*\"]', NULL, '2024-09-27 14:51:38', '2024-09-27 14:51:38'),
(647, 'App\\Models\\User', 51, 'main', 'ef100b3d02075bfab4924fe6566c12e28be1de388e4fcce6503969099d9d39ef', '[\"*\"]', NULL, '2024-09-27 15:00:25', '2024-09-27 15:00:25'),
(648, 'App\\Models\\User', 51, 'main', '2ce624172a53bc856ea2f3fb69ebac6bde3776f6d33bfc49a30947e84573da2e', '[\"*\"]', NULL, '2024-09-27 15:06:09', '2024-09-27 15:06:09'),
(649, 'App\\Models\\User', 51, 'main', '92b8715e86de22d7ce2f40bf5c7e48ec7bf32fd8b2e1d1e0b39d951ceae5ed1b', '[\"*\"]', NULL, '2024-09-27 15:18:09', '2024-09-27 15:18:09'),
(650, 'App\\Models\\User', 51, 'main', '34e468f46cc2f48c7ff06072eea5768b4e29a707757e4b3d629ce83916aff3c2', '[\"*\"]', NULL, '2024-09-27 15:23:44', '2024-09-27 15:23:44');

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sale_price` int NOT NULL,
  `purchase_price` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `quantity_alert` int NOT NULL,
  `picture` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `reference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `products_category_id_foreign` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `sale_price`, `purchase_price`, `quantity`, `quantity_alert`, `picture`, `category_id`, `created_at`, `updated_at`, `reference`) VALUES
(62, 'Poulet 1/4', 4000, 1500, 100, 20, NULL, 3, '2024-09-10 14:04:08', '2024-09-10 14:04:08', 'P001'),
(63, 'Jus naturel', 2000, 1500, 100, 20, NULL, 1, '2024-09-11 07:48:23', '2024-09-11 07:48:23', 'P002'),
(64, 'Chawama viande', 1500, 1000, 50, 20, NULL, 3, '2024-09-23 13:34:22', '2024-09-23 13:34:22', 'P003'),
(65, 'Malta', 1000, 500, 100, 20, NULL, 1, '2024-09-25 13:08:49', '2024-09-25 13:08:49', 'P004');

-- --------------------------------------------------------

--
-- Structure de la table `providers`
--

DROP TABLE IF EXISTS `providers`;
CREATE TABLE IF NOT EXISTS `providers` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `providers_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'CEO', NULL, '2024-06-24 09:06:02'),
(2, 'CAISSE', '2024-06-21 15:04:41', '2024-07-11 16:09:04'),
(3, 'SERVEUSE', '2024-06-21 15:05:22', '2024-07-11 16:08:56');

-- --------------------------------------------------------

--
-- Structure de la table `sales`
--

DROP TABLE IF EXISTS `sales`;
CREATE TABLE IF NOT EXISTS `sales` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `quantity` int NOT NULL,
  `sell_price` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_order_id_foreign` (`order_id`),
  KEY `sales_product_id_foreign` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sales`
--

INSERT INTO `sales` (`id`, `order_id`, `product_id`, `quantity`, `sell_price`, `created_at`, `updated_at`) VALUES
(12, 22, 62, 3, 4000, '2024-09-10 14:04:59', '2024-09-10 14:04:59'),
(13, 23, 63, 1, 2000, '2024-09-11 08:34:25', '2024-09-11 08:34:25'),
(14, 24, 62, 1, 4000, '2024-09-11 08:37:58', '2024-09-11 08:37:58'),
(15, 25, 63, 2, 2000, '2024-09-11 08:40:31', '2024-09-11 08:40:31'),
(16, 26, 62, 1, 4000, '2024-09-11 08:42:58', '2024-09-11 08:42:58'),
(17, 27, 62, 1, 4000, '2024-09-16 09:26:00', '2024-09-16 09:26:00'),
(18, 27, 62, 1, 4000, '2024-09-23 13:17:46', '2024-09-23 13:17:46'),
(19, 29, 64, 2, 1500, '2024-09-23 13:35:34', '2024-09-23 13:35:34'),
(20, 28, 62, 1, 4000, '2024-09-23 13:47:08', '2024-09-23 13:47:08'),
(21, 28, 62, 1, 4000, '2024-09-23 13:47:24', '2024-09-23 13:47:24'),
(22, 30, 63, 1, 2000, '2024-09-23 14:24:18', '2024-09-23 14:24:18'),
(23, 30, 64, 1, 1500, '2024-09-23 14:24:18', '2024-09-23 14:24:18'),
(24, 30, 62, 1, 4000, '2024-09-23 14:24:19', '2024-09-23 14:24:19'),
(25, 27, 62, 1, 4000, '2024-09-23 14:30:17', '2024-09-23 14:30:17'),
(26, 27, 62, 1, 4000, '2024-09-23 14:30:17', '2024-09-23 14:30:17'),
(27, 31, 63, 1, 2000, '2024-09-23 14:35:09', '2024-09-23 14:35:09'),
(28, 34, 65, 1, 1000, '2024-09-25 13:55:55', '2024-09-25 13:55:55'),
(29, 35, 62, 2, 4000, '2024-09-26 07:55:07', '2024-09-26 07:55:07'),
(30, 38, 62, 2, 4000, '2024-09-27 08:28:52', '2024-09-27 08:28:52'),
(31, 38, 63, 2, 2000, '2024-09-27 08:28:52', '2024-09-27 08:28:52');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `second_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cni_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `degree` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '3',
  `pseudo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pseudo',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_id_foreign` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `first_name`, `second_name`, `phone`, `email`, `email_verified_at`, `password`, `state`, `img`, `cni_number`, `role_id`, `remember_token`, `created_at`, `updated_at`, `degree`, `pseudo`) VALUES
(51, 'Admin', 'Option', '694310821', 'admin@gmail.com', NULL, '$2y$10$C5rdf7LNfxzFXJBcHrrtwOs4zGshTqaFrQ0OZiz3CCFFssATyafpW', 'asset', 'IMG-2024-08-07_14-58-45-1723039125665.png', '1234', 1, NULL, '2024-05-31 16:51:49', '2024-09-17 08:31:38', '1', 'option'),
(65, 'Denis', 'Kemayo', '698495395', 'kemayo278@gmail.com', NULL, '$2y$10$48tNoh2RUvdTy1SoTbrxgOhAyNm/2HszRrpMkWspW/bgiI/n6z2Xe', 'asset', 'IMG-2024-08-07_14-58-45-1723039125665.png', '128982988', 1, NULL, '2024-07-11 04:21:42', '2024-07-12 15:40:22', '3', 'den\'s'),
(66, 'Sss', 'Ssss', '656666666', 'ss@gmail.com', NULL, '$2y$10$Ok20EH1M1j.hQbk0FrChxuqQd.Pd0oe/ndAZRyoG2GBvoSwUMK1kK', 'asset', 'IMG-2024-08-07_14-58-45-1723039125665.png', '0021', 1, NULL, '2024-08-07 12:58:45', '2024-08-07 12:58:56', '1', 'sss');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `entries`
--
ALTER TABLE `entries`
  ADD CONSTRAINT `entries_provider_id_foreign` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`),
  ADD CONSTRAINT `entries_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `false_sales`
--
ALTER TABLE `false_sales`
  ADD CONSTRAINT `false_sales_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `false_sales_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
