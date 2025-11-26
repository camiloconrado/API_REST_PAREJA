Documentación 

1.	¿Qué es rate-limit?
Es un limitador de peticiones que puede hacer el usuario o una IP a la API, en un tiempo determinado y sirve para evitar peticiones masivas que lo puede hacer un bot y puede llegar a tumbar el servidor, también ayuda a mejorar la estabilidad y disponibilidad el servicio.

2.	¿Qué es CORS?
es un mecanismo de seguridad que permite peticiones https legitimas de diferentes orígenes, es decir mantiene la seguridad del navegador mientras se habilita la comunicación del Frontend y el backend de diferentes dominios, CORS es como una tarjeta de permisos donde puedo indicar que dominios autorizo para que se comuniquen con mi dominio y cuales no, para evitar ataques desde sitios maliciosos.

3.	 ¿Qué es JWT?
es como un ticket digital que permite una autenticación más ágil a la hora que el usuario ingresa, anteriormente cada requerimiento que se hacia todo se consultaba en una base de datos saturando la memoria, ahora con el JWT solo se verifica la firma digital y no hace consulta en la BD, por lo tanto, es más rápido.

	¿ qué es un token?
Es un código especial que sirve para iniciar sesión sin necesidad de ingresar contraseña

	¿ qué lleva dentro?
Un token (específicamente JWT) lleva 3 cosas:
	Información sobre cómo está hecho (Header)
	Información del usuario (Payload)
	Una firma de seguridad (Signature)

	¿ para qué se usa?
Uso principal: Autenticación y Autorización
1.	Login (primera vez):
Tú → Envías: usuario y contraseña
Servidor → Verifica que son correctos
Servidor → Te da un TOKEN
Tú → Guardas el token

2.	Peticiones posteriores:
Tú → "Quiero ver mi perfil" + TOKEN
Servidor → "Déjame verificar tu token..."
Servidor → "OK, tu token es válido, aquí está tu perfil"

•	Ejemplo práctico JWT:
JWT es un token de seguridad que nos permite ingresar una vez ya sea en la página web y/o Aplicación móvil.
Un ejemplo real donde se aplica seria tu aplicación bancaria quien te permite realizar transacciones iniciando sesión una única vez, después de cierto tiempo se cierra automáticamente por inactivad y nuevamente inicias sesión, mientras esta activa te permite hacer uso de ella como recargas de trasporte público, pagos, trasferencias.

•	Ejemplo práctico CORS:
CORS es un autorizador que permite la conexión con sitios externos o de distinto dominio 
Un ejemplo claro es cuando estas en una página o aplicación móvil de compras, al momento de que vas a realizar el pago la página te redirige a la plataforma de pago, sea PSE, la app de tu banco, si la página de origen tiene las plataformas de pago configuradas en su CORS el pago se efectuará correctamente, si no es así, la misma bloquear el pago ya que este no está autorizado para conectarse entre sí.

•	Ejemplo práctico de RATE-LIMIT
RATE-LIMIT es un limitador de intentos que te permite acceder a una página ya sea del banco, de tu correo y redes sociales
Un ejemplo claro seria las aplicaciones bancarias que te permiten un máximo de 3 intentos para acceder a tus cuentas bancarias esto se implementa para cuidar tu dinero, funciona igual en tus redes sociales y correos evitando que terceros tengan más oportunidades de descifrar tus claves y perder tu dinero o información personal
