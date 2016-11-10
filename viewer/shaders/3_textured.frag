#version 410

uniform float lightIntensity;
uniform sampler2D colorTexture;
uniform bool blinnPhong;
uniform float shininess;
uniform float eta;

in vec4 eyeVector;
in vec4 lightVector;
in vec4 vertColor;
in vec3 vertNormal;
in vec2 textCoords;

out vec4 fragColor;

void main( void )
{
    float ambiantReflection = 0.2;
    float diffuseReflection = 0.6;
    float specularReflection = 0.6;

    //Texture
    vec4 textColor = texture2D(colorTexture, textCoords);

    vec4 normal = vec4(vertNormal, 1.0);

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



    //fragColor =  ambient + diffuse + specular ;
    fragColor =  ambient + diffuse + specular;
}
