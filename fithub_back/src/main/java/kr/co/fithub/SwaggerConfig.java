package kr.co.fithub;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class SwaggerConfig {

	@Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("FitHub API 문서")
                .version("1.0")
                .description("FITHUB 백엔드 API 명세서입니다.")
                .contact(new Contact()
                    .name("FitHub")
                    .email("admin@fithub.com"))
                .license(new License()
                    .name("FitHub 프로젝트 정보")
                    .url("https://ubertech.notion.site/finalproject-schedule"))
            )
            .servers(List.of(
                new Server().url("http://localhost:8888").description("로컬 서버")
            ))
            .components(new Components()
                .addSecuritySchemes("AccessToken", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .in(SecurityScheme.In.HEADER)
                    .name("Authorization")
                )
            )
            .addSecurityItem(new SecurityRequirement().addList("AccessToken"));
    }
}