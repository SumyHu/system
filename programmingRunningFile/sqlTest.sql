ALTER SESSION SET NLS_LANGUAGE=AMERICAN;
clear SCR
SET SERVEROUTPUT ON
DECLARE
	i NUMBER;
	sumx NUMBER;
BEGIN 
	i := 0;
	sumx := 0;
	FOR i IN 1..100 LOOP
		sumx := sumx+i;
	END LOOP;
	dbms_output.put_line(sumx);
   dbms_output.put_line(' ');
END;
/
exit
/
exit