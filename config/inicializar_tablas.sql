-- Create the database
CREATE DATABASE IF NOT EXISTS `2pa-app`;
USE `2pa-app`;
DROP TABLE IF EXISTS users, likes, profiles, photos, likes_between_friends, 
matches, matches_2pa, friends, messages;

-- Create the 'users' table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    birth_date DATE,
    gender ENUM('male', 'female', 'other') NOT NULL,
    city VARCHAR(100),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_tag VARCHAR(50) UNIQUE NOT NULL -- Campo para el formato #usuario20
);

DROP TABLE IF EXISTS profiles;
-- Create the 'profiles' table for additional user information
CREATE TABLE profiles (
    user_id INT PRIMARY KEY,
    bio TEXT, -- User description
    interests JSON, -- Store interests as a list of tags
    min_age_preference INT, -- Minimum age preference for matches
    max_age_preference INT, -- Maximum age preference for matches
    preferred_city VARCHAR(100), -- Preferred city for matches
    altura INT, -- Height in cm (e.g., 175 for 1.75m)
    lifestyle JSON, -- Store lifestyle tags as an array
    preferences VARCHAR(100), 
    profile_picture VARCHAR(255), -- URL or path to profile picture
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create the 'likes' table to store user likes/dislikes
CREATE TABLE likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    liked_user_id INT NOT NULL,
    action ENUM('like', 'dislike') NOT NULL, -- Action to like or dislike
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (liked_user_id) REFERENCES users(user_id)
);

CREATE TABLE photos (
    photo_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    photo_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE likes_between_friends (
    like_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    liked_friend_id INT NOT NULL,
    action ENUM('like', 'dislike') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (liked_friend_id) REFERENCES users(user_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS matches;
-- Create the 'matches' table to store mutual matches
CREATE TABLE matches (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id_1 INT NOT NULL,
    user_id_2 INT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id_1) REFERENCES users(user_id),
    FOREIGN KEY (user_id_2) REFERENCES users(user_id)
);

CREATE TABLE matches_2pa (
    match_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id_1 INT NOT NULL,
    user_id_2 INT NOT NULL,
    friend_1_id INT NOT NULL,
    friend_2_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id_1) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_2) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_1_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_2_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create the 'messages' table to store messages between matched users
CREATE TABLE messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT NOT NULL,
    sender_user_id INT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches_2pa(match_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create the 'friends' table to store friendships between users
CREATE TABLE friends (
    friendship_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id_1 INT NOT NULL,
    user_id_2 INT NOT NULL,
    status ENUM('pending', 'confirmed', 'declined') DEFAULT 'pending', -- Friendship request status
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id_1) REFERENCES users(user_id),
    FOREIGN KEY (user_id_2) REFERENCES users(user_id)
);