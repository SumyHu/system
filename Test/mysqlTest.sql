use mysql;  

drop table book;
 
create table book   
 
(   
 
tisbn varchar(20) primary key,   
 
tbname varchar(100),   
 
tauthor varchar(100),   
 
bookdate date,   
 
bookpage int,   
 
leixing varchar(20),   
 
bprice float(6,2)   
 
);   
 
insert into book values ( '9787115167934', ' artist',   
 
'Diomidis Spinellis',   
 
'2008-1-10', 384,   
 
' computer ', 55.00 );   
 
insert into book values ( '9787111213826', 'Java',   
 
'Bruce Eckel',   
 
'2007-6-02', 880,   
 
' computer ', 108.00 );

select * from book;