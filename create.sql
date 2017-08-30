create database kingdom charset=utf8;


use kingdom;
-- FLUSH PRIVILEGES;
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,ALTER ON kingdom.* TO kingdom@localhost IDENTIFIED BY 'kingdom';
-- grant select,update,delete,insert on kingdom.*  to kingdom;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) DEFAULT NULL,
  `createtime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `openid` varchar(45) DEFAULT NULL,
  `lastlogintime` datetime DEFAULT NULL,
  `nickname` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `gameid` varchar(45) DEFAULT NULL,
  `groupid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
CREATE TABLE `group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupname` varchar(45) CHARACTER SET utf8 NOT NULL,
  `leaderid` int(11) DEFAULT NULL,
  `createtime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `mission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupid` int(11) NOT NULL,
  `missionname` varchar(45) CHARACTER SET utf8 NOT NULL,
  `missiondetail` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `missionlog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `missionid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `groupid` int(11) DEFAULT NULL,
  `createtime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `missionstate` int(11) DEFAULT NULL COMMENT '0-未提交，或者审核不通过\n1-提交待审核\n2-已完成',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `screenshot` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `groupid` int(11) NOT NULL,
  `missionid` int(11) NOT NULL,
  `missionlogid` int(11) NOT NULL,
  `imageid` varchar(45) NOT NULL,
  `createtime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

