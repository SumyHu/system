DECLARE
	i NUMBER;
	sumx NUMBER;
BEGIN
	i := 0;
	sumx := 0;
	FOR i IN 1..10 LOOP
		sumx := sumx+i;
	END LOOP;
	dbms_output.put_line('sum: ' || TO_CHAR(sumx));
END;

:quit