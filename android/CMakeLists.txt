cmake_minimum_required(VERSION 3.4.1)

set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 11)

add_library(traceroute
            SHARED
            ../cpp/traceroute-2.1.0/traceroute/time.c
            ../cpp/traceroute-2.1.0/traceroute/traceroute.c
            ../cpp/traceroute-2.1.0/traceroute/mod-icmp.c
            ../cpp/traceroute-2.1.0/traceroute/random.c
            ../cpp/traceroute-2.1.0/traceroute/poll.c
            ../cpp/traceroute-2.1.0/traceroute/csum.c
            ../cpp/traceroute-2.1.0/traceroute/mod-udp.c
            ../cpp/traceroute-2.1.0/traceroute/as_lookups.c
            ../cpp/traceroute-2.1.0/traceroute/extension.c
            ../cpp/traceroute-2.1.0/traceroute/mod-dccp.c
            ../cpp/traceroute-2.1.0/traceroute/mod-tcp.c
            ../cpp/traceroute-2.1.0/traceroute/mod-raw.c
            ../cpp/traceroute-2.1.0/traceroute/mod-tcpconn.c
            ../cpp/traceroute-2.1.0/traceroute/module.c
            ../cpp/traceroute-2.1.0/libsupp/clif.c
            traceroute-jni.c
)

# Specifies a path to native header files.
include_directories(
            ../cpp
            ../cpp/traceroute-2.1.0/include
            ../cpp/traceroute-2.1.0/libsupp
            ../cpp/traceroute-2.1.0/traceroute
)

target_link_libraries(traceroute PRIVATE log)
