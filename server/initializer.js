var db = require('./models/DB');

(function(){
    var initialize = function(){
        var userSql = "INSERT INTO `users` (`id`, `full_name`, `wechat_name`, `avatar_url`, `wechat_id`, `access_level`, `createdAt`, `updatedAt`) VALUES"+
            "(1, NULL, 'David', 'http://wx.qlogo.cn/mmopen/vi_32/hNcMYqibwsnnwBMpjYvKIgGWD5Oz0VCDIB18LV01suHW4foHyWzZ974XSKLVmuIqhtChvia9v14R1iahDnMVbxGVg/0', 'ooULt0Dxk13--jLtmccjepakucgI', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),"+
            "(2, NULL, 'Jin YOGA', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKibNLzQkiamsQItpibV2JicrOp82sQLxba7mYAxR3zszvrDAhpt9Q2kxMnIiaSibMCNFt9bfqUfEsiaosIg/0', 'ooULt0KV0MMH1k362vRbbciBK_og', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),"+
            "(3, NULL, 'Jin-可乐妈', 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erHCYAf0YKsAujQeHeiau5TKsLmxV6spqczrJ4ukiassLQQ20sGRHfFndPW5Xnx9STW3doxWuhaEmQw/0', 'ooULt0KZmfnqPI-NYBiJRx0upLeQ', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),"+
            "(4, NULL, '꧁ Z。妃 ꧂', 'http://wx.qlogo.cn/mmopen/vi_32/azI8gckEsJkhW2ibmstKiaicR6LProkz77NiavX3k8gCRaNQ2KFSqbbaIofLPafjicia2AaaOSpGuUibkzq0gicoanRuMQ/0', 'ooULt0AlZ5iXc7duPyQCKsXLDjlE', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),"+
            "(5, NULL, '小桃子', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL7NBlVAasYWBZcl2PKmjME64JuleWMfng3ciaicqGneibyic4BZ3ia9C4gq2oZwsu9HiccUMpH3FrubLdQ/0', 'ooULt0PKyZJGlUvQpogZJHgcKDeA', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),"+
            "(6, NULL, '孙萍', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLaqVibt7eUz5fzVuYGmYtMgQ4NEUibQxHGSNNT65MykJTcCN9ib9ZJQT5VMku4Nxnib2TicF9MOSib9ExQ/0', 'ooULt0ArmA2k7F0u5dlJyWfQWr3k', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),"+
            "(7, NULL, 'Kandice', 'http://wx.qlogo.cn/mmopen/vi_32/Sg04tg4rs4OMb6Q38tWKAlNHXkMEmQ8TLKAFTouSdoRgt7uWyuWLq0EUQkLy7p934RYezHd0hGbibxxHRxODD9g/0', 'ooULt0Hh3WWEVPtGP0WzsPKxKdM4', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);"
        
        var coachSql = "INSERT INTO `coaches` (`id`, `name`, `level`, `createdAt`, `updatedAt`) VALUES(1, 'Jin Jin', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);";
        var addressSql = "INSERT INTO `addresses` (`id`, `address`, `createdAt`, `updatedAt`) VALUES (1, '68 Lascelles Avenue Warradale SA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);";
        var bookTrigger = "CREATE TRIGGER `reduce_pay_number_after_book` BEFORE INSERT ON `bookings` FOR EACH ROW IF((SELECT id FROM `payments` WHERE userId = NEW.userId)>0) THEN UPDATE `payments` set times = times - 1 WHERE userId = NEW.userId; ELSE INSERT `payments`(`id`, `amount`, `times`,`createdAt`, `updatedAt`,`userId`) VALUES (DEFAULT, 0, -1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,NEW.userId); END IF";
        var cancelTrigger = "CREATE TRIGGER `increas_pay_number_after_cancel` BEFORE DELETE ON `bookings` FOR EACH ROW UPDATE `payments` set times = times + 1 WHERE userId = OLD.userId";
        
        db.sequelize.query(userSql);
        db.sequelize.query(coachSql);
        db.sequelize.query(addressSql);
        db.sequelize.query(bookTrigger);
        db.sequelize.query(cancelTrigger);
    }
    
    db.sequelize.sync().then(function(){
        initialize();
    })

})();
