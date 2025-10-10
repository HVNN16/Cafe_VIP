//package com.cafe.cafe_backend.config;
//
//import com.cafe.cafe_backend.repo.UserRepository;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Lazy;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.security.web.authentication.logout.LogoutFilter;
//
//@Configuration
//@EnableWebSecurity
//@EnableMethodSecurity(prePostEnabled = true)
//public class SecurityConfig {
//
//    private final JwtAuthFilter jwtAuthFilter;
//
//    public SecurityConfig(@Lazy JwtAuthFilter jwtAuthFilter) {
//        this.jwtAuthFilter = jwtAuthFilter;
//    }
//
//    @Bean
//    PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    UserDetailsService userDetailsService(UserRepository repo) {
//        return username -> repo.findByUsername(username)
//                .map(u -> org.springframework.security.core.userdetails.User.builder()
//                        .username(u.getUsername())
//                        .password(u.getPassword())
//                        .authorities("ROLE_" + u.getRole().toUpperCase())
//                        .build())
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//    }
//
//    @Bean
//    DaoAuthenticationProvider daoAuth(UserDetailsService uds, PasswordEncoder encoder) {
//        DaoAuthenticationProvider p = new DaoAuthenticationProvider();
//        p.setUserDetailsService(uds);
//        p.setPasswordEncoder(encoder);
//        return p;
//    }
//
//    @Bean
//    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//        return config.getAuthenticationManager();
//    }
//
//    @Bean
//    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable())
//                .cors(cors -> {})
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/api/auth/**").permitAll()
//                        .requestMatchers("/api/products/**").permitAll()
//                        .anyRequest().authenticated()
//                )
//                // Đặt JwtAuthFilter trước UsernamePasswordAuthenticationFilter
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//}
package com.cafe.cafe_backend.config;

import com.cafe.cafe_backend.repo.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(@Lazy JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    // ✅ Mã hóa mật khẩu
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ Load thông tin user từ MongoDB
    @Bean
    UserDetailsService userDetailsService(UserRepository repo) {
        return username -> repo.findByUsername(username)
                .map(u -> org.springframework.security.core.userdetails.User.builder()
                        .username(u.getUsername())
                        .password(u.getPassword())
                        .authorities("ROLE_" + u.getRole().toUpperCase())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    DaoAuthenticationProvider daoAuth(UserDetailsService uds, PasswordEncoder encoder) {
        DaoAuthenticationProvider p = new DaoAuthenticationProvider();
        p.setUserDetailsService(uds);
        p.setPasswordEncoder(encoder);
        return p;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // ✅ Cho phép frontend React (localhost:5173) gọi API
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    // ✅ Cấu hình quyền truy cập và filter
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {}) // Bật corsFilter phía trên
                .authorizeHttpRequests(auth -> auth
                        // Các route công khai (không cần login)
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/products/**").permitAll()

                        // Các route chỉ Admin được phép
                        .requestMatchers("/api/orders/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/api/tables/**").hasAnyRole("ADMIN", "USER")

                        // Mọi route khác yêu cầu xác thực
                        .anyRequest().authenticated()
                )
                // Đặt JWT filter trước UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
