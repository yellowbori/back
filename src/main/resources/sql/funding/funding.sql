create table tbl_funding (
                             id bigint unsigned auto_increment primary key,
                             investor_number int not null,
                             target_price int not null,
                             converge_price int not null,
                             genre_id bigint unsigned not null,
                             funding_status varchar(255) default 0,
                             constraint fk_funding_post foreign key (id)
                                 references tbl_post(id),
                             constraint fk_funding_genre foreign key (genre_id)
                                 references tbl_genre(id)
);