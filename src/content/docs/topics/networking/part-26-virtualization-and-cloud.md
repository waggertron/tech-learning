---
title: "Part 26: Virtualization and Cloud"
description: "Hypervisors, containers, virtual switching, NFV, SDN, cloud networking models, and data center topology architectures relevant to the CCNA."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

Modern infrastructure runs on virtual machines and containers. Network engineers who only know physical hardware are increasingly out of place: the switches, firewalls, and load balancers they configure may themselves be software running on commodity servers, and the networks those servers attach to may be defined in code and provisioned via API. This part covers virtualization concepts, cloud networking fundamentals, and the topology architectures the CCNA tests.

## Why it matters

The CCNA now includes virtualization and cloud as explicit exam domains. More importantly, these technologies are the context in which everything else you have learned operates. Routing protocols, VLANs, and access control lists all appear inside virtualized environments. Understanding how the virtual and physical layers relate prevents you from chasing phantom problems in the wrong place.

---

## Server virtualization

### Hypervisors

A hypervisor is the software layer that creates and manages virtual machines. VMs share the physical CPU, RAM, and storage of the host, but each VM has its own virtual hardware and is isolated from other VMs.

**Type 1 hypervisor (bare-metal)**: runs directly on the server hardware. There is no host operating system underneath. Type 1 hypervisors have lower overhead and are used in production data centers.

| Product | Vendor | Common context |
|---|---|---|
| ESXi | VMware (Broadcom) | Enterprise data centers |
| Hyper-V | Microsoft | Windows Server environments |
| KVM | Open source (Linux kernel) | OpenStack, cloud providers |

**Type 2 hypervisor (hosted)**: runs as an application on top of an existing operating system. There is more overhead because two OS layers are involved. Type 2 hypervisors are used for development, testing, and labs.

| Product | Vendor | Common context |
|---|---|---|
| VMware Workstation | VMware | Engineer laptops |
| VirtualBox | Oracle | Free; cross-platform |
| Parallels | Parallels | macOS |

### Virtual machine components

Each VM presents virtualized hardware to its guest operating system:

```text
Physical Server
+-----------------------------------------------------+
| Hypervisor                                          |
|  +----------------+      +----------------+         |
|  | VM 1           |      | VM 2           |         |
|  | Guest OS       |      | Guest OS       |         |
|  | vCPU: 4        |      | vCPU: 2        |         |
|  | vRAM: 8GB      |      | vRAM: 4GB      |         |
|  | vNIC: e1000    |      | vNIC: vmxnet3  |         |
|  | vDisk: 100GB   |      | vDisk: 50GB    |         |
|  +-------+--------+      +-------+--------+         |
|          |                       |                   |
|  +-------+-----------------------+--------+         |
|  | Virtual Switch (vSwitch)                |         |
|  +-----------------------------------------+        |
|          |                                           |
+----------+-------------------------------------------+
           |
    Physical NIC (uplink to physical switch)
```

Each vNIC appears to the guest OS as a real network adapter. Traffic between VMs on the same host may never leave the physical server if the vSwitch handles it locally.

---

## Container virtualization

### Containers vs VMs

Containers share the host OS kernel rather than running a full guest OS. This makes them lighter and faster to start than VMs, but with a different isolation model.

```text
VM model:
+--------------------+  +--------------------+
| App A              |  | App B              |
| Guest OS (Linux)   |  | Guest OS (Windows) |
+--------------------+  +--------------------+
| Hypervisor                                  |
+---------------------------------------------+
| Physical Hardware                           |
+---------------------------------------------+

Container model:
+--------+  +--------+  +--------+
| App A  |  | App B  |  | App C  |
+--------+  +--------+  +--------+
| Container Runtime (Docker)      |
| Host OS Kernel                  |
+---------------------------------+
| Physical Hardware               |
+---------------------------------+
```

| Property | VMs | Containers |
|---|---|---|
| Startup time | Seconds to minutes | Milliseconds to seconds |
| Size | GB (full OS) | MB (app + deps only) |
| Isolation | Full OS boundary | Shared kernel |
| Portability | Less portable (OS coupling) | Highly portable |
| Overhead | Higher | Lower |

The shared kernel is the critical tradeoff. A kernel vulnerability affects every container on the host. VMs are isolated by the hypervisor. A guest OS compromise does not reach other VMs in the same way.

### Docker and Kubernetes

**Docker** builds and runs containers. A Docker image is a layered filesystem containing the application and its dependencies. Running an image creates a container instance.

```bash
docker build -t myapp:1.0 .
docker run -d -p 8080:80 myapp:1.0
docker ps
```

**Kubernetes** orchestrates containers at scale: scheduling them across a cluster of nodes, restarting failed containers, scaling replicas up and down, and exposing services. Kubernetes adds its own networking layer (CNI plugins, Services, Ingress) on top of the container runtime.

---

## Virtual switching

VMs need to communicate with each other and with the physical network. Virtual switches provide this connectivity inside the hypervisor.

### VMware vSwitch (Standard vSwitch)

The VMware Standard vSwitch (VSS) operates like a physical Layer 2 switch inside a single ESXi host. VMs connect to port groups on the vSwitch. Uplink ports connect the vSwitch to physical NICs (the pNIC).

VMs in the same port group on the same host communicate locally through the vSwitch without touching the physical network. VMs in different port groups or on different hosts require traffic to traverse the physical network.

### VMware Distributed vSwitch (DVS)

The Distributed vSwitch spans multiple ESXi hosts and is managed centrally from vCenter. The same port group configuration applies consistently across all hosts in the cluster. VMs can migrate between hosts (vMotion) without losing network connectivity because the port group settings follow them.

### Open vSwitch (OVS)

Open vSwitch is an open-source virtual switch used in KVM and OpenStack environments. It supports:

- OpenFlow for SDN integration
- VXLAN and GRE tunnels for overlay networking
- Fine-grained traffic monitoring and statistics

OVS is the virtual switching foundation for OpenStack Neutron and many cloud provider implementations.

---

## Network Functions Virtualization (NFV)

### Concept

Traditional networks rely on dedicated physical appliances: a hardware firewall, a hardware load balancer, a hardware WAN optimizer. NFV replaces these with software instances running on commodity x86 servers.

```text
Traditional:
[Physical Router] -- [Physical Firewall] -- [Physical Load Balancer]

NFV:
[Commodity Server]
+-------------------------------------------+
| VNF: Router  |  VNF: Firewall  |  VNF: LB |
+-------------------------------------------+
| Hypervisor / Container Runtime            |
+-------------------------------------------+
```

A VNF (Virtual Network Function) is the software instance of a network function. Examples: Cisco CSR 1000v (virtual router), Palo Alto VM-Series (virtual firewall), F5 BIG-IP Virtual Edition (virtual load balancer).

### Benefits and tradeoffs

| Benefit | Tradeoff |
|---|---|
| Faster deployment (minutes vs weeks for hardware) | Performance may be lower than dedicated hardware |
| Scale on demand (add VNF instances under load) | Shared server resources introduce variable performance |
| Lower capital cost (commodity hardware) | Operational complexity increases |
| Geographic flexibility (deploy anywhere) | Licensing models can be complex |

NFV is the foundation of telco 5G core networks and cloud-native network functions. The CCNA tests the conceptual model, not VNF-specific configuration.

---

## Software-Defined Networking (SDN)

### Control plane vs data plane

Every traditional network device contains two logical functions:

- **Control plane**: decides where traffic should go. Runs routing protocols, builds the routing table, computes spanning tree. CPU-intensive.
- **Data plane**: forwards packets based on what the control plane decided. Hardware-accelerated; operates at line rate.

SDN separates these functions. The data plane stays in the switches and routers. The control plane moves to a centralized SDN controller.

```text
Application Layer (business apps, orchestration)
         |  Northbound API (REST, gRPC)
         v
+---------------------------+
|      SDN Controller       |  (centralized control plane)
|   (OpenDaylight, ONOS,    |
|    Cisco DNA Center)      |
+---------------------------+
         |  Southbound API (OpenFlow, NETCONF, gRPC)
         v
Infrastructure Layer
+----------+  +----------+  +----------+
| Switch A |  | Switch B |  | Switch C |
| (data    |  | (data    |  | (data    |
|  plane)  |  |  plane)  |  |  plane)  |
+----------+  +----------+  +----------+
```

### APIs in SDN

**Southbound APIs** connect the controller to network devices. The controller programs forwarding rules into switches.
- OpenFlow: the original SDN southbound protocol; programs flow tables
- NETCONF/RESTCONF: used by Cisco devices for configuration and state

**Northbound APIs** expose controller capabilities to applications and orchestration systems. Typically REST APIs returning JSON. An application can query network topology, request a path, or set a QoS policy through the northbound API without knowing anything about the underlying switch hardware.

### SDN does not eliminate the data plane

A common misconception: SDN centralizes control, but packets still move through physical (or virtual) switches. The switches still forward traffic at line rate using their ASICs. The controller only programs the forwarding tables. If the controller goes down, existing forwarding state persists in the switches. New flows may fail, but established ones continue.

---

## Cloud networking

### Service models

| Model | What the provider manages | Examples |
|---|---|---|
| IaaS (Infrastructure as a Service) | Physical hardware, hypervisor | AWS EC2, Azure VMs, GCP Compute Engine |
| PaaS (Platform as a Service) | Infrastructure + OS + runtime | Heroku, Google App Engine, Azure App Service |
| SaaS (Software as a Service) | Everything including the application | Office 365, Salesforce, Gmail |

As a network engineer, IaaS is most relevant: you configure virtual networks, subnets, routing tables, and security groups inside the cloud provider's environment.

### Deployment models

| Model | Description | Use case |
|---|---|---|
| Public cloud | Resources shared across tenants; provider-owned | Variable workloads, fast scaling |
| Private cloud | Dedicated infrastructure; org-owned or hosted | Regulatory requirements, predictable workloads |
| Hybrid cloud | Mix of public and private; connected | Burst to public, keep sensitive workloads private |
| Community cloud | Shared by organizations with common requirements | Government, healthcare consortia |

### Virtual Private Cloud (VPC)

A VPC is an isolated virtual network inside a public cloud. It is your network segment: you define the IP address space, create subnets, configure route tables, and control traffic with security groups and NACLs.

```text
AWS Region
+---------------------------------------------------------------+
| VPC: 10.0.0.0/16                                              |
|                                                               |
|  Availability Zone A         Availability Zone B              |
|  +---------------------+     +---------------------+          |
|  | Public Subnet       |     | Public Subnet       |          |
|  | 10.0.1.0/24         |     | 10.0.3.0/24         |          |
|  | [Web Server]        |     | [Web Server]        |          |
|  +---------------------+     +---------------------+          |
|  | Private Subnet      |     | Private Subnet      |          |
|  | 10.0.2.0/24         |     | 10.0.4.0/24         |          |
|  | [Database]          |     | [Database]          |          |
|  +---------------------+     +---------------------+          |
|          |                                                     |
|  [Route Table] --> [Internet Gateway]                         |
+---------------------------------------------------------------+
```

Key VPC components:
- **Subnets**: subdivide the VPC address space; tied to one availability zone
- **Route tables**: control where traffic is directed; one per subnet
- **Internet gateway**: allows public subnets to reach the internet
- **NAT gateway**: allows private subnets to initiate outbound internet connections without exposing private IPs
- **Security groups**: stateful firewall rules attached to instances; track connection state
- **NACLs (Network ACLs)**: stateless firewall rules at the subnet boundary; require explicit inbound and outbound rules

### Cloud connectivity options

| Option | Description | Latency | Cost | Use case |
|---|---|---|---|---|
| Internet | Standard internet routing | Variable | Lowest | Dev/test, non-sensitive traffic |
| VPN (IPsec) | Encrypted tunnel over internet | Variable + overhead | Low | Secure site-to-cloud; tolerates variability |
| Direct Connect (AWS) / ExpressRoute (Azure) | Dedicated private circuit from your facility to cloud | Lowest and consistent | Highest | Production workloads, compliance requirements |

Direct Connect and ExpressRoute bypass the public internet entirely. Traffic runs on a dedicated fiber connection from your data center (or colocation facility) to the cloud provider's edge. This gives the lowest and most predictable latency and is required by some compliance frameworks.

---

## Network topology architectures

### Three-tier campus (traditional)

The traditional enterprise campus model has three distinct layers:

```text
                     [Core Layer]
                  (high-speed backbone)
                  /                  \
         [Dist A]                  [Dist B]
       (routing, policy)        (routing, policy)
        /      \                   /      \
   [Acc 1]  [Acc 2]           [Acc 3]  [Acc 4]
   (port     (port             (port    (port
    density)  density)          density)  density)
```

- **Core**: high-speed interconnect between distribution blocks; no policy enforcement; optimized for speed
- **Distribution**: routing, policy enforcement, inter-VLAN routing, aggregates access layer uplinks
- **Access**: connects end devices (PCs, phones, APs); port density; minimal intelligence

The three-tier model scales well for large campuses with hundreds of switches but requires careful design to avoid oversubscription at the distribution layer.

### Two-tier (collapsed core)

For smaller campuses, the distribution and core layers merge into a single tier:

```text
         [Collapsed Core/Distribution]
          /       |       |       \
      [Acc 1] [Acc 2] [Acc 3] [Acc 4]
```

Fewer devices, lower cost, simpler management. The tradeoff is that the collapsed core carries both backbone and policy workloads, which can become a bottleneck as the network grows.

### Spine-leaf (data center)

Spine-leaf is designed for east-west traffic in modern data centers where servers communicate constantly with each other (storage, microservices, databases).

```text
          [Spine 1]         [Spine 2]
         /    |    \       /    |    \
      [L1]  [L2]  [L3]  [L4]  [L5]  [L6]
      (Leaf switches, every leaf connects to every spine)
       |     |     |     |     |     |
      Rack  Rack  Rack  Rack  Rack  Rack
```

Every leaf switch connects to every spine switch. There are no direct leaf-to-leaf connections. Any server-to-server traffic takes exactly two hops: leaf to spine to leaf. This fixed two-hop latency is predictable and easy to reason about.

Adding capacity is straightforward: add a leaf switch for more server ports, or add a spine switch for more bandwidth between leaves (and update every leaf to connect to the new spine).

| Property | Three-tier | Spine-leaf |
|---|---|---|
| Traffic pattern | North-south (client to server) | East-west (server to server) |
| Latency | Variable (depends on topology) | Fixed two hops |
| Scaling | Add switches per tier | Add leaf or spine |
| Common context | Enterprise campus | Modern data center |

---

## Gotchas

**Containers share the kernel; VMs do not.** A kernel vulnerability on a container host affects every container running on it. VMs are isolated by the hypervisor boundary. For workloads with strong isolation requirements (payment processing, different trust levels), VMs provide a stronger boundary. Many production systems run containers inside VMs to get both the efficiency of containers and the isolation of VMs.

**SDN does not eliminate the data plane.** The controller programs forwarding rules, but packets still traverse physical or virtual switches. If you lose the controller, existing flows continue; new flows that require controller decisions may fail depending on the configuration. Design for controller redundancy.

**Cloud security groups are stateful; NACLs are stateless.** In AWS, a security group tracks connection state: if you allow inbound TCP 443, the return traffic is automatically allowed. NACLs apply rules to every packet independently: you must explicitly allow both inbound and outbound traffic for a connection to work. Forgetting to add the outbound NACL rule is a common misconfiguration.

**VPC subnets are tied to one availability zone.** A subnet cannot span AZs. For high availability, create subnets in at least two AZs and deploy application components in each. A single-AZ deployment has no protection against an AZ outage.

**Spine-leaf requires uniform cabling.** Every leaf must connect to every spine. In a 4-spine, 40-leaf fabric, each leaf needs 4 uplinks and each spine needs 40 downlinks. Plan physical cabling and optics costs carefully before committing to spine count.

---

## References

- [Cisco CCNA Virtualization and Cloud Study Guide](https://www.cisco.com/c/en/us/training-events/training-certifications/exams/current-list/ccna-200-301.html)
- [AWS VPC Documentation](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [ONF Introduction to SDN](https://opennetworking.org/sdn-definition/)
- [ETSI NFV Overview](https://www.etsi.org/technologies/nfv)
- [Open vSwitch Documentation](https://docs.openvswitch.org/)

## Related topics

- [Part 1: Introduction to Networking](./part-01-intro-to-networking)
- [Part 19: Network Security Fundamentals](./part-19-network-security-fundamentals)
- [Part 20: WAN Technologies and Network Automation](./part-20-wan-technologies-and-network-automation)
