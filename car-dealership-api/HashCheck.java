import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class HashCheck {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        boolean match = encoder.matches("admin123", "$2a$10$wY1twJw3FcjQE.cOvq49Nez.Zl7cPxO7hL1S0J.qFp0j3b9xY/Dfq");
        System.out.println("Match: " + match);
    }
}
