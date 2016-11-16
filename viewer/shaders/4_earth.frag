#version 410
#define M_PI 3.14159265358979323846

uniform float lightIntensity;
uniform sampler2D earthDay;
uniform sampler2D earthNormals;
uniform mat3x3 normalMatrix;
uniform bool blinnPhong;
uniform float shininess;
uniform float eta;

in vec4 eyeVector;
in vec4 lightVector;
in vec4 vertColor;
in vec3 vertNormal;
in vec4 position;

out vec4 fragColor;

void main( void )
{

    //texture
    vec4 d =  position ;

    float u = 0.5 - atan(d.y,d.x)/(2*M_PI);
    float v = 1 - acos(d.z)/(M_PI);

    vec2 textCoords = vec2(u,v);

    vec3 n = normalize(vertNormal);
    vec3 t = normalize(vec3(-n.z, 0, n.x));
    vec3 b = cross(n, t);

    vec4 textColor = texture2D(earthDay, textCoords);
    //textColor = vec4(1);

    vec3 bump = (texture2D(earthNormals, textCoords)).xyz;
    bump = -1 + 2*bump;

    vec3 normal3 = normalMatrix * mat3x3(t,b,n) * bump;


    //textColor = vec4(normal3,1);
    float ambiantReflection = 0.2;
    float diffuseReflection = 0.6;
    float specularReflection = 0.6;

    vec4 normal = vec4(normal3, 1.0);

    vec4 ambient = ambiantReflection * textColor * lightIntensity;
    vec4 diffuse = diffuseReflection*textColor*max(dot(normal,lightVector),0)*lightIntensity;
    vec4 specular;

    vec4 halfVector = (eyeVector + lightVector)/ length(eyeVector + lightVector);
    vec4 reflectedVector = 2 * (dot(normal,lightVector))* normal - lightVector;

    if(blinnPhong)
    {
        specular = specularReflection*textColor*pow(max(dot(halfVector,normal),0),4*shininess)*lightIntensity;
    }
    else
    {
       specular = specularReflection*textColor*pow(max(dot(reflectedVector,eyeVector),0),shininess)*lightIntensity;
    }

    //Fresnel Coefficient
    float fo = pow(1 - eta,2) /  pow(1 + eta,2);
    float f = fo + (1- fo) * pow(1 - dot(halfVector, eyeVector),5);
    specular = specular * f;


    fragColor =  ambient + diffuse + specular;
}
