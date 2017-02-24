SET SERVEROUTPUT ON
DECLARE
	i NUMBER;
	sumx NUMBER;
BEGIN
	i := 0;
	sumx := 0;
	FOR i IN 1..10 LOOP
		sumx := sumx+i;
	END LOOP;
<<<<<<< HEAD:Test/sqlTest.sql
	dbms_output.put_line('sum: ' || TO_CHAR(sumx));
END;

:quit
=======
	dbms_output.put_line(sumx);
END;
/
exit
>>>>>>> 81b0ce3ec220019d1ded152f492890021f6ae1d4:programmingRunningFile/sqlTest.sql
