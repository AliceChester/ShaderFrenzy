#version 410

uniform float lightIntensity;
uniform bool blinnPhong;
uniform float shininess;
uniform float eta;

in vec4 eyeVector;
in vec4 lightVector;
in vec3 vertNormal;
in vec4 vertColor;

out vec4 fragColor;

void main( void )
{
    vec4 ambient = 0.2 * vertColor * lightIntensity;
    vec4 diffuse = 0.4*vertColor*max(dot(vertNormal,lightVector),0)*lightIntensity;
    vec4 specular;

    if(blinnPhong)
    {
        vec4 halfVector = normalize(eyeVector + lightVector);
        specular = 0.4*vertColor*pow(max(dot(halfVector,eyeVector),0),4*shininess)*lightIntensity;
    }
    else
    {
        vec4 reflectedVector = 2 * (dot(vertNormal,lightVector))* vertNormal - lightVector;
       specular = 0.4*vertColor*pow(max(dot(reflectedVector,eyeVector),0),shininess)*lightIntensity;

    }
    // vertColor = ambient + diffuse+specular;
    vertColor.x = 1.0;
     fragColor = vertColor;
}
