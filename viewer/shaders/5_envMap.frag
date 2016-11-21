#version 410
#define M_PI 3.14159265358979323846

uniform sampler2D envMap;
uniform mat4 lightMatrix;
uniform bool transparent;
uniform float eta;

in vec4 vertColor;
in vec3 vertNormal;
in vec4 eyeVector;

out vec4 fragColor;


void main( void )
{
    // Here begins the real work.

    vec4 normal = vec4(vertNormal, 1.0);
    vec4 reflectedVector = 2 * (dot(normal.xyz,eyeVector.xyz))* normal - eyeVector;

    float u = 0.5 - atan(reflectedVector.x,reflectedVector.z)/(2*M_PI);
    float v = 1 - acos(reflectedVector.y)/(M_PI);
    vec4 colorReflected = texture2D(envMap,vec2(u,v));

    //refracted
    float cos1 = dot(normal, -eyeVector);
    float cos2 = sqrt(1 - pow((1/eta),2)*(1 - pow(cos1,2)));
    vec4 refractedVector = (1/eta)*eyeVector + ((1/eta)*cos1 - cos2)*normal;
    float u2 = 0.5 - atan(refractedVector.x,refractedVector.z)/(2*M_PI);
    float v2 = 1 - acos(refractedVector.y)/(M_PI);
    vec4 colorRefracted = texture2D(envMap,vec2(u2,1-v2));


    //Fresnel Coefficient
    vec4 halfVector = vec4((eyeVector.xyz + reflectedVector.xyz)/ length(eyeVector.xyz + reflectedVector.xyz), 0);
    float fo = pow(1 - eta,2) /  pow(1 + eta,2);
    float f = fo + (1- fo) * pow(1 - dot(halfVector, eyeVector),5);

    if(transparent)
    {
        fragColor = colorReflected*f + (1-f)*colorRefracted;
    }
    else
    {
        fragColor = colorReflected ;
    }




}
