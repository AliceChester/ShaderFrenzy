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
in vec2 textCoords;

out vec4 fragColor;

void main( void )
{


    vec4 textColor = texture2D(earthDay, textCoords);
    fragColor = textColor;
}
