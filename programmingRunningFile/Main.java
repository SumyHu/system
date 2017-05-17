import java.util.Scanner;
public class Main {
	public int sum(int a, int b) {
		return a+b;
	}
	public static void main(String[] args) {
		 Scanner scan = new Scanner(System.in).useDelimiter("\\D");
		 int n1 = scan.nextInt();
		 int n2 = scan.nextInt();
      scan.close();
		 Main instance = new Main();
		 System.out.println(instance.sum(n1, n2));
	}
}